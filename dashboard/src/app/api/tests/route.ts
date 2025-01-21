import { NextResponse } from 'next/server';
import { exec, ChildProcess } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import axios from 'axios';

const execAsync = promisify(exec);

interface CommandResult {
  stdout: string;
  stderr: string;
}

// Keep track of running tests
const runningTests = new Map<string, { process: ChildProcess, startTime: Date, output: string, error: string }>();

export async function POST(request: Request) {
  try {
    const { action, options, dryRun = false } = await request.json();
    console.log('API Request:', { action, options, dryRun });

    if (!options?.suite) {
      console.log('Error: Missing suite option');
      return NextResponse.json({ error: 'Suite option is required' }, { status: 400 });
    }

    // Handle status check
    if (action === 'status') {
      const isRunning = runningTests.has(options.suite);
      const runningTest = runningTests.get(options.suite);
      console.log('Status check:', { suite: options.suite, isRunning });
      
      return NextResponse.json({ 
        isRunning,
        startTime: runningTest?.startTime || null,
        output: runningTest?.output || '',
        error: runningTest?.error || ''
      });
    }

    // Handle test execution
    if (action === 'run') {
      const command = `npm run ${options.suite}`;
      console.log('Preparing to run command:', command);
      
      if (dryRun) {
        return NextResponse.json({
          command,
          message: 'Dry run successful',
          timestamp: new Date().toISOString()
        });
      }

      // Check if test is already running
      if (runningTests.has(options.suite)) {
        console.log('Test already running:', options.suite);
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
        console.log('Current directory:', process.cwd());
        
        const childProcess = exec(command, {
          cwd: rootDir,
          maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        }) as ChildProcess;

        // Store the running test with output tracking
        runningTests.set(options.suite, {
          process: childProcess,
          startTime: new Date(),
          output: '',
          error: ''
        });

        // Track output
        childProcess.stdout?.on('data', (data) => {
          const test = runningTests.get(options.suite);
          if (test) {
            test.output = (test.output || '') + data;
          }
        });

        childProcess.stderr?.on('data', (data) => {
          const test = runningTests.get(options.suite);
          if (test) {
            test.error = (test.error || '') + data;
          }
        });

        console.log('Test process started:', options.suite);

        // Handle test completion
        childProcess.on('exit', (code) => {
          console.log('Test process exited:', { suite: options.suite, code });
          runningTests.delete(options.suite);
        });

        // Wait for the command to complete
        let exitCode: number | null = null;
        const { stdout, stderr } = await new Promise<CommandResult>((resolve, reject) => {
          let output = '';
          let errorOutput = '';

          childProcess.stdout?.on('data', (data) => {
            console.log('Test output:', data);
            output += data;
          });

          childProcess.stderr?.on('data', (data) => {
            console.error('Test error:', data);
            errorOutput += data;
          });

          childProcess.on('close', (code) => {
            console.log('Test process closed:', { suite: options.suite, code });
            exitCode = code;
            resolve({ stdout: output, stderr: errorOutput });
          });

          childProcess.on('error', (err) => {
            console.error('Test process error:', err);
            reject(err);
          });
        });

        console.log('Test execution completed');
        return NextResponse.json({
          command,
          message: stderr ? 'Test execution completed with warnings' : 'Test execution completed successfully',
          output: stdout,
          stderr,
          code: exitCode,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        // Clean up the running test entry if there's an error
        console.error('Error executing test:', error);
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