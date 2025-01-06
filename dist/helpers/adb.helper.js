"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdbHelper = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs = __importStar(require("fs/promises"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class AdbHelper {
    static async dumpUiHierarchy(outputPath = './src/config/ui_dump.xml') {
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
        }
        catch (error) {
            console.error('Failed to dump UI hierarchy:', error);
            throw error;
        }
    }
    static async parseUiDump(content) {
        const selectors = {};
        // Extract resource-ids
        const resourceIdRegex = /resource-id="([^"]+)"/g;
        let match;
        while ((match = resourceIdRegex.exec(content)) !== null) {
            const [, resourceId] = match;
            const shortName = resourceId.split('/').pop() || resourceId;
            selectors[shortName] = `android=resourceId("${resourceId}")`;
        }
        return selectors;
    }
    /**
     * Clear app data to force sign out
     */
    static async forceSignOut() {
        try {
            // Clear app data which will force sign out
            await execAsync('adb shell pm clear com.philo.philo');
            // Optional: Kill the app process
            await execAsync('adb shell am force-stop com.philo.philo');
        }
        catch (error) {
            console.error('Failed to force sign out:', error);
            throw error;
        }
    }
}
exports.AdbHelper = AdbHelper;
