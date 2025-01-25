import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  console.log('POST /api/execute-suite received');
  try {
    const body = await request.json();
    console.log('Request body:', body);

    if (!body.suiteId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing suiteId in request'
      }, { status: 400 });
    }

    // Map suite IDs to test file paths
    const suiteToPath = {
      'test:search': 'src/tests/search.test.ts',
      'test:login': 'src/tests/login.test.ts',
      'test:navigation': 'src/tests/navigation.test.ts',
      'test:playback': 'src/tests/playback.test.ts',
      'test:landing': 'src/tests/landingPage.test.ts',
      'test:series': 'src/tests/seriesDetails.test.ts',
      'test:movies': 'src/tests/moviesDetails.test.ts'
    };

    const testPath = suiteToPath[body.suiteId];
    if (!testPath) {
      return NextResponse.json({ 
        success: false,
        error: `Unknown test suite: ${body.suiteId}`
      }, { status: 400 });
    }

    try {
      console.log(`Executing test suite: ${testPath}`);
      // Change to the root directory where tests are located
      const rootDir = path.resolve(process.cwd(), '..');
      console.log('Root directory:', rootDir);
      console.log('Current working directory:', process.cwd());

      // Check if the test file exists
      try {
        await execAsync(`ls ${path.join(rootDir, testPath)}`);
      } catch (error) {
        console.error('Test file not found:', error);
        return NextResponse.json({ 
          success: false,
          error: `Test file not found: ${testPath}`,
          output: '',
          errors: 'Test file not found'
        }, { status: 404 });
      }

      // Execute the test suite
      const command = `cd ${rootDir} && NODE_OPTIONS=--experimental-vm-modules jest ${testPath}`;
      console.log('Executing command:', command);
      
      const { stdout, stderr } = await execAsync(command);
      console.log('Test output:', stdout);
      if (stderr) console.error('Test errors:', stderr);

      // Check if the test actually ran
      if (!stdout && !stderr) {
        return NextResponse.json({ 
          success: false,
          error: 'No test output received',
          output: '',
          errors: 'Test execution produced no output'
        }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true,
        output: stdout,
        errors: stderr || undefined
      });
    } catch (error: any) {
      console.error('Test execution error:', error);
      return NextResponse.json({ 
        success: false,
        error: `Test execution failed: ${error.message}`,
        output: error.stdout || '',
        errors: error.stderr || error.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in execute-suite route:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'An unknown error occurred',
      output: '',
      errors: error.message
    }, { status: 500 });
  }
} 