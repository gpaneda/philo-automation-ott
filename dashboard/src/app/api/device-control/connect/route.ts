import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  console.log('POST /api/device-control/connect received');
  try {
    const { deviceId, deviceIp, email } = await request.json();
    console.log('Request body:', { deviceId, deviceIp, email });
    
    if (!deviceId || !deviceIp) {
      console.log('Missing required parameters');
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Try to connect to the device using ADB
    try {
      console.log('Executing ADB connect command:', `adb connect ${deviceIp}:5555`);
      await execAsync(`adb connect ${deviceIp}:5555`);
      
      // Verify connection by checking device list
      const { stdout } = await execAsync('adb devices');
      console.log('ADB devices output:', stdout);
      const isConnected = stdout.includes(deviceIp);
      
      if (!isConnected) {
        console.log('Device connection failed - device not found in adb devices list');
        throw new Error('Device connection failed');
      }

      console.log('Device connection successful');
      return NextResponse.json({ connected: true });
    } catch (error: any) {
      console.error('ADB connection error:', error);
      return NextResponse.json({ 
        error: `Failed to connect to device: ${error.message}`,
        connected: false 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in device-control route:', error);
    return NextResponse.json({ 
      error: error.message || 'An unknown error occurred',
      connected: false 
    }, { status: 500 });
  }
} 