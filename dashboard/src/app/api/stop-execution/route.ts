import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  console.log('POST /api/stop-execution received');
  try {
    const body = await request.json();
    console.log('Request body:', body);

    if (!body.suiteId) {
      return NextResponse.json({ 
        success: false,
        error: 'Missing suiteId in request'
      }, { status: 400 });
    }

    // Kill any running test processes
    try {
      // Find any running jest processes for this suite
      const { stdout: psOutput } = await execAsync('ps aux | grep jest');
      const processes = psOutput.split('\n')
        .filter(line => line.includes(body.suiteId))
        .map(line => line.split(/\s+/)[1]) // Get PID
        .filter(Boolean);

      // Kill each process
      for (const pid of processes) {
        await execAsync(`kill -9 ${pid}`);
      }

      return NextResponse.json({ 
        success: true,
        message: 'Test execution stopped'
      });
    } catch (error: any) {
      console.error('Error stopping test processes:', error);
      return NextResponse.json({ 
        success: false,
        error: `Failed to stop test processes: ${error.message}`
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      success: false,
      error: `Request processing failed: ${error.message}`
    }, { status: 500 });
  }
} 