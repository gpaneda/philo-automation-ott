import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);

// Keep track of running tests
const runningTests = new Map<string, { process: any, startTime: Date }>();

export async function POST(request: Request) {
  try {
    const { action, options, dryRun = false } = await request.json();

    if (!options?.suite) {
      return NextResponse.json({ error: 'Suite option is required' }, { status: 400 });
    }

    // Handle status check
    if (action === 'status') {
      const isRunning = runningTests.has(options.suite);
      return NextResponse.json({ 
        isRunning,
        startTime: isRunning ? runningTests.get(options.suite)?.startTime : null
      });
    }

    // Handle test execution
    if (action === 'run') {
      const command = `npm run ${options.suite}`;
      
      if (dryRun) {
        return NextResponse.json({
          command,
          message: 'Dry run successful',
          timestamp: new Date().toISOString()
        });
      }

      // Check if test is already running
      if (runningTests.has(options.suite)) {
        return NextResponse.json({ 
          error: 'Test is already running',
          startTime: runningTests.get(options.suite)?.startTime
        }, { status: 409 });
      }

      try {
        // Execute the command from the root directory
        const rootDir = path.resolve(process.cwd(), '..');
        console.log('Executing command:', command);
        console.log('Working directory:', rootDir);
        
        const childProcess = exec(command, {
          cwd: rootDir,
          maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        });

        // Store the running test
        runningTests.set(options.suite, {
          process: childProcess,
          startTime: new Date()
        });

        // Handle test completion
        childProcess.on('exit', () => {
          runningTests.delete(options.suite);
        });

        // Wait for the command to complete
        const { stdout, stderr } = await new Promise((resolve, reject) => {
          let output = '';
          let errorOutput = '';

          childProcess.stdout?.on('data', (data) => {
            output += data;
          });

          childProcess.stderr?.on('data', (data) => {
            errorOutput += data;
          });

          childProcess.on('close', (code) => {
            resolve({ stdout: output, stderr: errorOutput });
          });

          childProcess.on('error', (err) => {
            reject(err);
          });
        });

        return NextResponse.json({
          command,
          message: stderr ? 'Test execution completed with warnings' : 'Test execution completed successfully',
          output: stdout,
          stderr,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        // Clean up the running test entry if there's an error
        runningTests.delete(options.suite);
        throw error;
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Error in /api/tests:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'An unknown error occurred'
    }, { status: 500 });
  }
} 