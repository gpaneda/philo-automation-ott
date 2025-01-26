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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function consolidateReports() {
    const reportsDir = path.join(process.cwd(), 'reports');
    const files = await fs.promises.readdir(reportsDir);
    const reportFiles = files.filter(f => f.startsWith('consolidated-report-') && f.endsWith('.html'));
    const results = [];
    let totalSuites = 0;
    let totalTests = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let totalDuration = 0;
    for (const file of reportFiles) {
        const content = await fs.promises.readFile(path.join(reportsDir, file), 'utf8');
        // Extract test counts using regex
        const suiteMatch = content.match(/Total test suites: (\d+)/);
        const testsMatch = content.match(/Total Tests: (\d+)/);
        const passedMatch = content.match(/Passed: (\d+)/);
        const failedMatch = content.match(/Failed: (\d+)/);
        const durationMatch = content.match(/Total Duration: ([\d.]+)s/);
        if (suiteMatch && testsMatch && passedMatch && failedMatch && durationMatch) {
            totalSuites += parseInt(suiteMatch[1]);
            totalTests += parseInt(testsMatch[1]);
            totalPassed += parseInt(passedMatch[1]);
            totalFailed += parseInt(failedMatch[1]);
            totalDuration += parseFloat(durationMatch[1]);
            // Extract test details
            const detailsMatch = content.match(/<h2>Detailed Results<\/h2>([\s\S]*?)<\/body>/);
            if (detailsMatch) {
                results.push({
                    file,
                    totalTests: parseInt(testsMatch[1]),
                    passedTests: parseInt(passedMatch[1]),
                    failedTests: parseInt(failedMatch[1]),
                    duration: parseFloat(durationMatch[1]),
                    details: [detailsMatch[1]]
                });
            }
        }
    }
    // Generate consolidated report
    const report = `
<!DOCTYPE html>
<html>
<head>
    <title>Consolidated Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .passed { color: #2ecc71; }
        .failed { color: #e74c3c; }
        .suite { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
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
            width: ${(totalPassed / totalTests * 100).toFixed(1)}%;
            transition: width 0.5s ease-in-out;
        }
    </style>
</head>
<body>
    <h1>Consolidated Test Report</h1>
    
    <div class="summary">
        <h2>Overall Summary</h2>
        <p>Total Test Suites: ${totalSuites}</p>
        <p>Total Tests: ${totalTests}</p>
        <p>Passed: <span class="passed">${totalPassed}</span></p>
        <p>Failed: <span class="failed">${totalFailed}</span></p>
        <p>Pass Rate: ${(totalPassed / totalTests * 100).toFixed(1)}%</p>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <p>Total Duration: ${totalDuration.toFixed(2)}s</p>
    </div>

    <h2>Individual Suite Results</h2>
    ${results.map(result => `
        <div class="suite">
            <h3>${result.file}</h3>
            <p>Tests: ${result.totalTests} (${result.passedTests} passed, ${result.failedTests} failed)</p>
            <p>Duration: ${result.duration.toFixed(2)}s</p>
            ${result.details}
        </div>
    `).join('')}
</body>
</html>`;
    // Write consolidated report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const consolidatedPath = path.join(reportsDir, `final-report-${timestamp}.html`);
    await fs.promises.writeFile(consolidatedPath, report);
    console.log(`Final consolidated report generated at: ${consolidatedPath}`);
    // Print summary to console
    console.log('\nTest Summary:');
    console.log('=============');
    console.log(`Total Test Suites: ${totalSuites}`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${totalPassed}`);
    console.log(`Failed: ${totalFailed}`);
    console.log(`Pass Rate: ${(totalPassed / totalTests * 100).toFixed(1)}%`);
    console.log(`Total Duration: ${totalDuration.toFixed(2)}s`);
}
consolidateReports().catch(console.error);
