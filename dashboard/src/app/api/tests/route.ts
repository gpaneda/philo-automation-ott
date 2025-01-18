import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);

async function isAppiumRunning() {
  try {
    await axios.get('http://localhost:4723/wd/hub/status');
    return true;
  } catch (error) {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, options, dryRun = false } = body;

    if (action === 'run') {
      if (!options?.suite) {
        return NextResponse.json({ error: 'Suite name is required' }, { status: 400 });
      }

      const command = `npm run ${options.suite}`;
      
      // Get the root directory (one level up from dashboard)
      const rootDir = path.resolve(process.cwd(), '../');

      // If dry run, just return the command
      if (dryRun) {
        return NextResponse.json({
          message: 'Dry run successful',
          command
        });
      }

      // Check if Appium is running
      const appiumRunning = await isAppiumRunning();
      if (!appiumRunning) {
        return NextResponse.json({
          message: 'Test execution failed',
          error: 'Appium server is not running. Please start Appium server with: npm run start:appium',
        }, { status: 400 });
      }

      // Execute the actual command
      try {
        const { stdout, stderr } = await execAsync(command, {
          cwd: rootDir,
          env: { ...process.env },
          maxBuffer: 1024 * 1024 * 10 // 10MB buffer for larger outputs
        });

        // Parse test results if possible
        let parsedOutput;
        try {
          parsedOutput = stdout.split('\n').filter(Boolean).join('\n');
        } catch (e) {
          parsedOutput = stdout;
        }

        return NextResponse.json({
          message: stderr ? 'Test execution completed with warnings' : 'Test execution completed successfully',
          command,
          output: parsedOutput,
          error: stderr || null,
          timestamp: new Date().toISOString()
        });
      } catch (execError: any) {
        return NextResponse.json({
          message: 'Test execution failed',
          command,
          error: execError.message,
          output: execError.stdout || null,
          stderr: execError.stderr || null,
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 