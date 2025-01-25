import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Cache device status checks to prevent too frequent calls
const statusCache = new Map<string, { status: boolean; timestamp: number }>();
const CACHE_TTL = 5000; // 5 seconds

type RouteParams = {
  params: {
    deviceId: string;
  };
};

export async function GET(
  request: NextRequest,
  context: RouteParams
) {
  try {
    const { deviceId } = context.params;
    
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 });
    }

    // Check cache first
    const cached = statusCache.get(deviceId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        deviceId,
        connected: cached.status,
        lastChecked: new Date(cached.timestamp).toISOString()
      });
    }

    // Check device connection
    const { stdout } = await execAsync('adb devices');
    const lines = stdout.split('\n');
    const deviceLine = lines.find(line => line.startsWith(deviceId));
    const isConnected = deviceLine?.includes('device') ?? false;

    // Update cache
    statusCache.set(deviceId, {
      status: isConnected,
      timestamp: Date.now()
    });

    return NextResponse.json({
      deviceId,
      connected: isConnected,
      lastChecked: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error checking device status:', error);
    return NextResponse.json(
      { error: 'Failed to check device status' },
      { status: 500 }
    );
  }
} 