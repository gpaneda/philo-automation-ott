import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface TestResult {
    file: string;
    success: boolean;
    error?: string;
    duration?: number;
    testResults?: {
        name: string;
        status: 'passed' | 'failed';
        duration: number;
        error?: string;
    }[];
}

async function isAppiumRunning(): Promise<boolean> {
    try {
        await execAsync('lsof -i:4723');
        return true;
    } catch (error) {
        return false;
    }
}

async function startAppium(): Promise<void> {
    try {
        await execAsync('npm run start:appium');
        // Wait for Appium to be ready
        await new Promise(resolve => setTimeout(resolve, 10000));
    } catch (error) {
        console.error('Error starting Appium:', error);
        throw error;
    }
}

async function killAppium(): Promise<void> {
    try {
        await execAsync('pkill -f appium');
        // Wait for port to be released
        await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
        // Ignore error if Appium is not running
    }
}

async function restartAppium(): Promise<void> {
    console.log('Restarting Appium...');
    await killAppium();
    await startAppium();
    console.log('Appium restarted successfully');
}

async function runTest(testFile: string): Promise<TestResult> {
    try {
        console.log(`Running test: ${testFile}`);
        const command = `NODE_OPTIONS=--experimental-vm-modules jest ${testFile} --no-cache --forceExit --detectOpenHandles --json`;
        const { stdout } = await execAsync(command, {
            maxBuffer: 10 * 1024 * 1024 // 10MB buffer
        });
        
        try {
            const jsonResult = JSON.parse(stdout);
            const testResults = jsonResult.testResults[0];
            
            return {
                file: testFile,
                success: testResults.status === 'passed',
                duration: testResults.endTime - testResults.startTime,
                testResults: testResults.assertionResults.map((result: any) => ({
                    name: result.title,
                    status: result.status === 'passed' ? 'passed' : 'failed',
                    duration: result.duration || 0,
                    error: result.failureMessages?.join('\n')
                }))
            };
        } catch (parseError) {
            console.error('Error parsing test results:', parseError);
            return {
                file: testFile,
                success: false,
                error: 'Failed to parse test results'
            };
        }
    } catch (error: any) {
        return {
            file: testFile,
            success: false,
            error: error.message
        };
    }
}

async function getAllTestFiles(): Promise<string[]> {
    const testDir = path.join(process.cwd(), 'src', 'tests');
    const files = await fs.promises.readdir(testDir);
    return files
        .filter(file => file.endsWith('.test.ts'))
        .map(file => path.join('src', 'tests', file));
}

function generateHtmlReport(results: TestResult[]): string {
    const totalTests = results.reduce((sum, result) => 
        sum + (result.testResults?.length || 0), 0);
    const passedTests = results.reduce((sum, result) => 
        sum + (result.testResults?.filter(t => t.status === 'passed').length || 0), 0);
    const failedTests = totalTests - passedTests;
    const totalDuration = results.reduce((sum, result) => 
        sum + (result.duration || 0), 0);

    const totalSuites = results.length;
    const passedSuites = results.filter(r => r.success).length;
    const failedSuites = totalSuites - passedSuites;

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Test Execution Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .suite { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .suite-header { display: flex; justify-content: space-between; align-items: center; }
        .test { margin: 10px 0; padding: 10px; border-left: 3px solid #ddd; }
        .passed { color: #2ecc71; }
        .failed { color: #e74c3c; }
        .error { background: #fff5f5; padding: 10px; margin: 5px 0; white-space: pre-wrap; font-family: monospace; font-size: 0.9em; }
        .duration { color: #666; font-size: 0.9em; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .stat-box { background: #fff; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .progress-bar { 
            height: 20px;
            background: #f0f0f0;
            border-radius: 10px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: #2ecc71;
            width: ${(passedTests/totalTests * 100).toFixed(1)}%;
            transition: width 0.5s ease-in-out;
        }
    </style>
</head>
<body>
    <h1>Test Execution Report</h1>
    
    <div class="summary">
        <h2>Summary</h2>
        <div class="stats">
            <div class="stat-box">
                <h3>Test Suites</h3>
                <p>Total: ${totalSuites}</p>
                <p class="passed">Passed: ${passedSuites}</p>
                <p class="failed">Failed: ${failedSuites}</p>
            </div>
            <div class="stat-box">
                <h3>Individual Tests</h3>
                <p>Total: ${totalTests}</p>
                <p class="passed">Passed: ${passedTests}</p>
                <p class="failed">Failed: ${failedTests}</p>
            </div>
        </div>
        <div class="stat-box">
            <h3>Pass Rate</h3>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <p>${(passedTests/totalTests * 100).toFixed(1)}% (${passedTests}/${totalTests})</p>
        </div>
        <p class="duration">Total Duration: ${(totalDuration / 1000).toFixed(2)} seconds</p>
    </div>

    <h2>Detailed Results</h2>
    ${results.map(suite => `
        <div class="suite">
            <div class="suite-header">
                <h3>${suite.file}</h3>
                <span class="${suite.success ? 'passed' : 'failed'}">${suite.success ? 'PASSED' : 'FAILED'}</span>
            </div>
            ${suite.duration ? `<p class="duration">Duration: ${(suite.duration / 1000).toFixed(2)}s</p>` : ''}
            ${suite.error ? `<div class="error">${suite.error}</div>` : ''}
            ${suite.testResults ? suite.testResults.map(test => `
                <div class="test">
                    <h4>${test.name} - <span class="${test.status}">${test.status.toUpperCase()}</span></h4>
                    <p class="duration">Duration: ${(test.duration / 1000).toFixed(2)}s</p>
                    ${test.error ? `<div class="error">${test.error}</div>` : ''}
                </div>
            `).join('') : ''}
        </div>
    `).join('')}
</body>
</html>`;
}

async function main() {
    try {
        // Ensure Appium is running
        if (!await isAppiumRunning()) {
            await startAppium();
        }

        const testFiles = await getAllTestFiles();
        const allResults: TestResult[] = [];
        let consecutiveFailures = 0;

        for (const testFile of testFiles) {
            const result = await runTest(testFile);
            allResults.push(result);
            
            if (!result.success) {
                consecutiveFailures++;
                console.log(`Test failed: ${testFile}`);
                if (result.error) console.log(result.error);
                
                if (consecutiveFailures >= 3) {
                    console.log('Multiple consecutive failures detected, restarting Appium...');
                    await restartAppium();
                    consecutiveFailures = 0;
                }
            } else {
                consecutiveFailures = 0;
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        // Generate single consolidated report
        const reportPath = path.join(process.cwd(), 'test-report.html');
        await fs.promises.writeFile(reportPath, generateHtmlReport(allResults));
        console.log(`\nTest execution completed. Report generated at: ${reportPath}`);

        // Print summary to console
        const totalTests = allResults.reduce((sum, result) => 
            sum + (result.testResults?.length || 0), 0);
        const passedTests = allResults.reduce((sum, result) => 
            sum + (result.testResults?.filter(t => t.status === 'passed').length || 0), 0);
        
        console.log('\nTest Summary:');
        console.log('=============');
        console.log(`Total Suites: ${allResults.length}`);
        console.log(`Passed Suites: ${allResults.filter(r => r.success).length}`);
        console.log(`Failed Suites: ${allResults.filter(r => !r.success).length}`);
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed Tests: ${passedTests}`);
        console.log(`Failed Tests: ${totalTests - passedTests}`);

        // List failed tests
        const failedTests = allResults
            .filter(r => !r.success || r.testResults?.some(t => t.status === 'failed'))
            .map(r => ({
                suite: r.file,
                tests: r.testResults?.filter(t => t.status === 'failed').map(t => t.name) || []
            }));

        if (failedTests.length > 0) {
            console.log('\nFailed Tests:');
            failedTests.forEach(failure => {
                console.log(`\n${failure.suite}:`);
                failure.tests.forEach(test => console.log(`  - ${test}`));
            });
        }

    } catch (error) {
        console.error('Error running tests:', error);
        process.exit(1);
    }
}

main(); 