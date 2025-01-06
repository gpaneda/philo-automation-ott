"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestReporter_1 = require("./TestReporter");
class CustomJestReporter {
    constructor(globalConfig, options) {
        this.driver = global.driver;
    }
    async onTestResult(test, testResult, aggregatedResults) {
        for (const result of testResult.testResults) {
            const testName = result.title;
            const status = result.status === 'passed' ? 'pass' : 'fail';
            // Log test result
            await TestReporter_1.TestReporter.logTestResult(testName, status, result.status === 'failed' ? new Error(result.failureMessages.join('\n')) : undefined);
            // Take screenshot if driver is available
            if (this.driver) {
                await TestReporter_1.TestReporter.takeScreenshot(this.driver, testName, status);
            }
        }
    }
    async onRunComplete(contexts, results) {
        console.log('\nTest Run Summary:');
        console.log(`Total Tests: ${results.numTotalTests}`);
        console.log(`Passed Tests: ${results.numPassedTests}`);
        console.log(`Failed Tests: ${results.numFailedTests}`);
        console.log(`Skipped Tests: ${results.numPendingTests}`);
        console.log(`Time Taken: ${(Date.now() - results.startTime) / 1000}s`);
    }
}
exports.default = CustomJestReporter;
