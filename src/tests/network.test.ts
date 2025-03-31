import { NetworkHelper } from '../helpers/network.helper';
import * as fs from 'fs';
import * as path from 'path';

describe('Network Scanner Tests', () => {
    it('should scan network and save results to log file', async () => {
        // Create logs directory if it doesn't exist
        const logsDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }

        // Create a timestamp for the log file
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const logFile = path.join(logsDir, `network-scan-${timestamp}.log`);

        // Create a write stream for the log file
        const logStream = fs.createWriteStream(logFile);

        // Override console.log to write to both console and file
        const originalConsoleLog = console.log;
        console.log = (...args: any[]) => {
            originalConsoleLog(...args);
            logStream.write(args.join(' ') + '\n');
        };

        try {
            // Run the network scan
            await NetworkHelper.scanAndLogDevices();
        } finally {
            // Restore original console.log
            console.log = originalConsoleLog;
            // Close the log file
            logStream.end();
        }

        // Verify log file was created
        expect(fs.existsSync(logFile)).toBe(true);
    });
}); 