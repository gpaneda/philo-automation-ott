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
  if (!data) return '';
  
  try {
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    const timestamp = result.timestamp ? `\nTimestamp: ${new Date(result.timestamp).toLocaleString()}` : '';
    
    // Filter the output to show only essential information
    let filteredOutput = '';
    if (result.output) {
      const lines = result.output.split('\n');
      const essentialLines = lines.filter((line: string) => 
        line.includes('console.log') && (
          line.includes('Clearing app data') ||
          line.includes('App data cleared') ||
          line.includes('Attempting to launch') ||
          line.includes('App launch completed') ||
          line.includes('Test completed')
        )
      ).map((line: string) => line.split('console.log')[1].trim());
      
      if (essentialLines.length > 0) {
        filteredOutput = `\nKey Events:\n${essentialLines.join('\n')}`;
      }
    }

    return `Test Execution Summary:
Command: ${result.command}
Status: ${result.message}${timestamp}${filteredOutput}
${result.error ? `\nErrors:\n${result.error}` : ''}
${result.stderr ? `\nStandard Error:\n${result.stderr}` : ''}`
      .trim();
  } catch (e) {
    return JSON.stringify(data, null, 2);
  }
}

export default function TestRunner() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedSuite, setSelectedSuite] = useState(TEST_SUITES[0].id);
  const [isDryRun, setIsDryRun] = useState(true);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    if (isRunning && !isDryRun) {
      setError('A test is already running. Please wait for it to complete.');
      return;
    }

    setLoading(true);
    setError('');
    if (!isDryRun) {
      setIsRunning(true);
    }

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'run',
          options: {
            suite: selectedSuite
          },
          dryRun: isDryRun
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run test');
      }

      setResult(JSON.stringify(data, null, 2));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
      if (!isDryRun) {
        setIsRunning(false);
      }
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

        {result && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-900">
              {isDryRun ? 'Command Preview' : 'Test Results'}
            </h3>
            <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-100 p-4 rounded">
              {formatTestOutput(result)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 