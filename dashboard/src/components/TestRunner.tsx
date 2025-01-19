'use client';

import { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';

const TEST_SUITES = [
  { id: 'test:series', name: 'Series Details Tests' },
  { id: 'test:landing', name: 'Landing Page Tests' },
  { id: 'test:login', name: 'Login Tests' },
  { id: 'test:movies', name: 'Movies Details Tests' },
  { id: 'test:navigation', name: 'Navigation Tests' },
  { id: 'test:playback', name: 'Playback Tests' }
];

function formatTestOutput(data: any) {
  if (!data) return { text: '', counts: { total: 0, passed: 0, failed: 0 } };
  
  try {
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    const timestamp = result.timestamp ? `\nTimestamp: ${new Date(result.timestamp).toLocaleString()}` : '';
    
    // Count test cases and filter output
    let filteredOutput = '';
    const counts = { total: 0, passed: 0, failed: 0 };
    
    if (result.output) {
      // First get raw lines for test counting
      const rawLines = result.output.split('\n');
      console.log('Raw test output:', rawLines);
      
      // Look for test summary line first
      const summaryLine = rawLines.find((line: string) => 
        line.includes('Tests:') && line.includes('total')
      );
      
      if (summaryLine) {
        console.log('Found summary line:', summaryLine);
        const totalMatch = summaryLine.match(/(\d+)\s+total/);
        if (totalMatch) counts.total = parseInt(totalMatch[1]);
        
        const passedMatch = summaryLine.match(/(\d+)\s+passed/);
        if (passedMatch) counts.passed = parseInt(passedMatch[1]);
        
        const failedMatch = summaryLine.match(/(\d+)\s+failed/);
        if (failedMatch) counts.failed = parseInt(failedMatch[1]);
      } else {
        // Count individual test cases
        const testCases = rawLines.filter((line: string) => 
          (line.includes('PASS') || line.includes('FAIL')) && 
          line.includes('src/tests/series.test.ts')
        );
        console.log('Found test cases:', testCases);
        
        counts.total = testCases.length;
        counts.passed = testCases.filter((line: string) => line.includes('PASS')).length;
        counts.failed = counts.total - counts.passed;
      }
      
      // Now filter for display
      const essentialLines = rawLines
        .filter((line: string) => 
          !line.includes('at ') &&
          (
            line.includes('Test completed') ||
            line.includes('✅') ||
            line.includes('❌') ||
            line.includes('Step') ||
            line.includes('Verifying') ||
            (line.includes('PASS') && line.includes('series.test.ts')) ||
            (line.includes('FAIL') && line.includes('series.test.ts'))
          )
        )
        .map((line: string) => {
          if (line.includes('console.log')) {
            const parts = line.split('console.log');
            return parts[1]?.trim().replace(/^["']|["']$/g, '') || line;
          }
          return line;
        });
      
      if (essentialLines.length > 0) {
        filteredOutput = `\nResults:\n${essentialLines.join('\n')}`;
      }
    }

    return {
      text: `Test Execution Summary:
Command: ${result.command}
Status: ${result.message}${timestamp}${filteredOutput}
${result.error ? `\nErrors:\n${result.error}` : ''}`.trim(),
      counts
    };
  } catch (e) {
    console.error('Error formatting test output:', e);
    return { 
      text: JSON.stringify(data, null, 2),
      counts: { total: 0, passed: 0, failed: 0 }
    };
  }
}

export default function TestRunner() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedSuite, setSelectedSuite] = useState(TEST_SUITES[0].id);
  const [isDryRun, setIsDryRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState<string | { text: string; counts: { total: number; passed: number; failed: number } }>('');

  const runTest = async () => {
    setIsLoading(true);
    setIsRunning(true);
    setOutput('');
    setError('');
    
    // Set up timeout
    const timeoutId = setTimeout(() => {
      setIsRunning(false);
      setOutput('UI timeout reached (5 minutes). Note: The test might still be running in the background. Please check the test history for final results.');
    }, 300000); // 5 minutes

    try {
      // First check if Appium is running
      const appiumResponse = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status',
          options: { suite: selectedSuite }
        })
      });

      const appiumStatus = await appiumResponse.json();
      
      if (!isDryRun && appiumStatus.error?.includes('ECONNREFUSED')) {
        setError('Appium server is not running. Please start Appium before running tests.');
        setIsRunning(false);
        setIsLoading(false);
        clearTimeout(timeoutId);
        return;
      }

      // Proceed with test execution
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          options: { suite: selectedSuite },
          dryRun: isDryRun
        })
      });

      const data = await response.json();
      
      // Get formatted output and test counts
      const { text: formattedOutput, counts: testResults } = formatTestOutput(data);

      // Set the output with test counts
      setOutput(`Command: ${data.command}
Status: ${data.message}
Timestamp: ${new Date().toLocaleString()}
Results: ${testResults.passed}/${testResults.total} tests passed${testResults.failed > 0 ? ` (${testResults.failed} failed)` : ''}

${formattedOutput}`);
      
      clearTimeout(timeoutId);
    } catch (err) {
      setOutput(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      clearTimeout(timeoutId);
    } finally {
      setIsLoading(false);
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-lg font-medium text-gray-900">Test Runner</h2>
        <p className="text-sm text-gray-500">Run test suites or preview commands</p>
        {isRunning && (
          <p className="mt-2 text-sm text-blue-600">
            Test is currently running...
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="suite" className="block text-sm font-medium text-gray-700">
            Select Test Suite
          </label>
          <select
            id="suite"
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            disabled={isRunning}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:opacity-50"
          >
            {TEST_SUITES.map((suite) => (
              <option key={suite.id} value={suite.id}>
                {suite.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsDryRun(true);
              runTest();
            }}
            disabled={loading || isRunning}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Preview Command
          </button>

          <button
            onClick={() => {
              setIsDryRun(false);
              runTest();
            }}
            disabled={loading || isRunning}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isRunning ? 'Running Test...' : 'Processing...'}
              </>
            ) : (
              <>
                <PlayIcon className="-ml-1 mr-2 h-5 w-5" />
                Run Test
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 rounded-md">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {output && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">
              {isDryRun ? 'Command Preview' : 'Test Results'}
            </h3>
            <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-100 p-4 rounded">
              {typeof output === 'string' ? output : output.text}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 