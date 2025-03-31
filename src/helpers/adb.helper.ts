import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

export class AdbHelper {
    static async dumpUiHierarchy(outputPath = './src/config/ui_dump.xml'): Promise<string> {
        try {
            // Dump UI hierarchy to device
            await execAsync('adb shell uiautomator dump /sdcard/ui_dump.xml');
            
            // Pull the file from device
            await execAsync(`adb pull /sdcard/ui_dump.xml ${outputPath}`);
            
            // Read the file content
            const content = await fs.readFile(outputPath, 'utf-8');
            
            // Clean up the file on device
            await execAsync('adb shell rm /sdcard/ui_dump.xml');
            
            return content;
        } catch (error: unknown) {
            console.error('Failed to dump UI hierarchy:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to dump UI hierarchy: ${error.message}`);
            }
            throw new Error('Failed to dump UI hierarchy: Unknown error');
        }
    }

    static async parseUiDump(content: string): Promise<Record<string, string>> {
        try {
            const selectors: Record<string, string> = {};
            
            // Extract resource-ids
            const resourceIdRegex = /resource-id="([^"]+)"/g;
            let match;
            
            while ((match = resourceIdRegex.exec(content)) !== null) {
                const [, resourceId] = match;
                const shortName = resourceId.split('/').pop() || resourceId;
                selectors[shortName] = `android=resourceId("${resourceId}")`;
            }
            
            return selectors;
        } catch (error: unknown) {
            console.error('Failed to parse UI dump:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to parse UI dump: ${error.message}`);
            }
            throw new Error('Failed to parse UI dump: Unknown error');
        }
    }

    /**
     * Clear app data to force sign out
     */
    static async forceSignOut(): Promise<void> {
        try {
            // Clear app data which will force sign out
            await execAsync('adb shell pm clear com.philo.philo');
            
            // Optional: Kill the app process
            await execAsync('adb shell am force-stop com.philo.philo');
        } catch (error: unknown) {
            console.error('Failed to force sign out:', error);
            if (error instanceof Error) {
                throw new Error(`Failed to force sign out: ${error.message}`);
            }
            throw new Error('Failed to force sign out: Unknown error');
        }
    }
} 