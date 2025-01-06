"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestReporter = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class TestReporter {
    static async init() {
        await this.ensureDirectories();
    }
    static async takeScreenshot(driver, testName, status) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const screenshotPath = path_1.default.join(this.SCREENSHOTS_DIR, `${testName}_${status}_${timestamp}.png`);
            await driver.saveScreenshot(screenshotPath);
            console.log(`Screenshot saved: ${screenshotPath}`);
            return screenshotPath;
        }
        catch (error) {
            console.error('Failed to take screenshot:', error);
            return null;
        }
    }
    static async logTestResult(testName, status, error) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            testName,
            status,
            timestamp,
            error: error ? {
                message: error.message,
                stack: error.stack
            } : undefined
        };
        try {
            const logPath = path_1.default.join(this.REPORTS_DIR, 'test-results.json');
            let existingLogs = [];
            try {
                const content = await promises_1.default.readFile(logPath, 'utf-8');
                existingLogs = JSON.parse(content);
            }
            catch (_a) {
                // File doesn't exist or is empty, start with empty array
            }
            existingLogs.push(logEntry);
            await promises_1.default.writeFile(logPath, JSON.stringify(existingLogs, null, 2));
        }
        catch (error) {
            console.error('Failed to log test result:', error);
        }
    }
    static async ensureDirectories() {
        for (const dir of [this.SCREENSHOT_BASE_DIR, this.SCREENSHOTS_DIR, this.REPORTS_DIR]) {
            try {
                await promises_1.default.access(dir);
            }
            catch (_a) {
                await promises_1.default.mkdir(dir, { recursive: true });
            }
        }
    }
}
exports.TestReporter = TestReporter;
TestReporter.SCREENSHOT_BASE_DIR = path_1.default.join(process.cwd(), 'test-results');
TestReporter.SCREENSHOTS_DIR = path_1.default.join(TestReporter.SCREENSHOT_BASE_DIR, 'screenshots');
TestReporter.REPORTS_DIR = path_1.default.join(TestReporter.SCREENSHOT_BASE_DIR, 'reports');
