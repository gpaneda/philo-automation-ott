'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  status: string;
  lastRun: string;
  runningTests: string[];
  output?: string;
}

const TEST_SUITES = [
  {
    id: 'test:landing',
    name: 'Landing Page Tests',
    description: 'Tests for the main landing page functionality',
    totalTests: 3,
    passedTests: 3,
    failedTests: 0,
    status: 'passed',
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    runningTests: [],
  },
  {
    id: 'test:movies',
    name: 'Movies Details Tests',
    description: 'Validation of movie details page and interactions',
    totalTests: 2,
    passedTests: 1,
    failedTests: 1,
    status: 'failed',
    lastRun: new Date(Date.now() - 7200000).toISOString(),
    runningTests: [],
  },
  {
    id: 'test:navigation',
    name: 'Navigation Tests',
    description: 'Core navigation and menu interaction tests',
    totalTests: 12,
    passedTests: 8,
    failedTests: 0,
    status: 'passed',
    lastRun: new Date(Date.now() - 1800000).toISOString(),
    runningTests: [],
  },
  {
    id: 'test:playback',
    name: 'Playback Tests',
    description: 'Video playback and player controls testing',
    totalTests: 2,
    passedTests: 2,
    failedTests: 0,
    status: 'passed',
    lastRun: new Date(Date.now() - 5400000).toISOString(),
    runningTests: [],
  },
  {
    id: 'test:series',
    name: 'Series Details Tests',
    description: 'TV series details and episode navigation tests',
    totalTests: 5,
    passedTests: 3,
    failedTests: 0,
    status: 'passed',
    lastRun: new Date(Date.now() - 900000).toISOString(),
    runningTests: [],
  },
  {
    id: 'test:login',
    name: 'Login Tests',
    description: 'Authentication and user session management',
    totalTests: 1,
    passedTests: 1,
    failedTests: 0,
    status: 'passed',
    lastRun: new Date(Date.now() - 4500000).toISOString(),
    runningTests: [],
  }
];

function formatTestOutput(data: any) {
  if (!data) return '';
  
  try {
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    const timestamp = result.timestamp ? `\nTimestamp: ${new Date(result.timestamp).toLocaleString()}` : '';
    
    let filteredOutput = '';
    if (result.output) {
      const lines = result.output.split('\n');
      const essentialLines = lines
        .filter((line: string) => 
          line.includes('console.log') && 
          !line.includes('at ') &&
          (
            line.includes('Test completed') ||
            line.includes('✅') ||
            line.includes('❌')
          )
        )
        .map((line: string) => {
          const parts = line.split('console.log');
          return parts[1]?.trim().replace(/^["']|["']$/g, '') || line;
        });
      
      if (essentialLines.length > 0) {
        filteredOutput = `\nResults:\n${essentialLines.join('\n')}`;
      }
    }

    return `Test Execution Summary:
Command: ${result.command}
Status: ${result.message}${timestamp}${filteredOutput}
${result.error ? `\nErrors:\n${result.error}` : ''}`
      .trim();
  } catch (e) {
    return JSON.stringify(data, null, 2);
  }
}

export default function TestSuites() {
  const router = useRouter();
  const [suites, setSuites] = useState<TestSuite[]>(TEST_SUITES);
  const [expandedSuites, setExpandedSuites] = useState<string[]>([]);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Cleanup function for intervals and timeouts
  const cleanup = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  // Function to check test status
  const checkTestStatus = async (suiteId: string) => {
    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status',
          options: { suite: suiteId }
        })
      });

      const data = await response.json();
      
      if (data.isRunning) {
        // Test is still running, extend timeout
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
        
        timeoutId.current = setTimeout(() => {
          setSuites(prevSuites => 
            prevSuites.map(suite => 
              suite.id === suiteId 
                ? { 
                    ...suite, 
                    status: 'warning',
                    runningTests: [],
                    output: 'UI timeout reached. The test is still running in the background. Please check the test history for final results.'
                  }
                : suite
            )
          );
          cleanup();
        }, 300000); // Reset to 5 minutes
      } else {
        // Test is no longer running, clean up and update status
        cleanup();
        // Fetch final results
        const finalResponse = await fetch('/api/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'run',
            options: { suite: suiteId },
            dryRun: false
          })
        });
        
        const finalData = await finalResponse.json();
        updateTestResults(suiteId, finalData);
      }
    } catch (error) {
      console.error('Error checking test status:', error);
    }
  };

  const updateTestResults = (suiteId: string, data: any) => {
    const hasFailures = data.output && (
      data.output.includes('Test Suites: 1 failed') ||
      data.output.includes('Tests:       1 failed') ||
      data.output.includes('FAIL ')
    );

    setSuites(prevSuites => 
      prevSuites.map(suite => 
        suite.id === suiteId 
          ? { 
              ...suite, 
              status: hasFailures ? 'failed' : (data.stderr ? 'completed with warnings' : 'passed'),
              lastRun: new Date().toISOString(),
              runningTests: [],
              output: formatTestOutput(data)
            }
          : suite
      )
    );
  };

  const runTest = async (suiteId: string) => {
    cleanup(); // Clean up any existing intervals/timeouts

    // Set initial running state
    setSuites(prevSuites => 
      prevSuites.map(suite => 
        suite.id === suiteId 
          ? { ...suite, status: 'running', runningTests: ['Running...'] }
          : suite
      )
    );

    // Set initial timeout
    timeoutId.current = setTimeout(() => {
      setSuites(prevSuites => 
        prevSuites.map(suite => 
          suite.id === suiteId 
            ? { 
                ...suite, 
                status: 'warning',
                runningTests: [],
                output: 'UI timeout reached. The test is still running in the background. Please check the test history for final results.'
              }
            : suite
        )
      );
      cleanup();
    }, 300000); // Initial 5 minute timeout

    // Start heartbeat check every 30 seconds
    heartbeatInterval.current = setInterval(() => {
      checkTestStatus(suiteId);
    }, 30000);

    try {
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          options: { suite: suiteId },
          dryRun: false
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        cleanup();
        throw new Error(data.error || 'Failed to run test');
      }

      updateTestResults(suiteId, data);
      cleanup();
    } catch (error) {
      cleanup();
      setSuites(prevSuites => 
        prevSuites.map(suite => 
          suite.id === suiteId 
            ? { 
                ...suite, 
                status: 'failed',
                lastRun: new Date().toISOString(),
                runningTests: [],
                output: error instanceof Error ? error.message : 'An unknown error occurred'
              }
            : suite
        )
      );
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => cleanup();
  }, []);

  const toggleSuiteExpansion = (suiteId: string) => {
    setExpandedSuites(prev => 
      prev.includes(suiteId) 
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Suites</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and manage test suites
        </p>
      </div>

      <div className="space-y-4">
        {suites.map((suite) => (
          <div key={suite.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleSuiteExpansion(suite.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {expandedSuites.includes(suite.id) ? '▼' : '▶'}
                  </button>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{suite.name}</h3>
                    <p className="text-sm text-gray-500">{suite.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {suite.status === 'running' ? (
                      <div className="flex items-center text-blue-600">
                        <ArrowPathIcon className="w-5 h-5 animate-spin mr-2" />
                        Running...
                      </div>
                    ) : suite.status === 'failed' ? (
                      <XCircleIcon className="w-5 h-5 text-red-500" />
                    ) : suite.status === 'warning' ? (
                      <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    )}
                    <span className="text-sm text-gray-500">
                      {suite.passedTests}/{suite.totalTests} passed
                    </span>
                  </div>

                  <button
                    onClick={() => runTest(suite.id)}
                    disabled={suite.status === 'running'}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {suite.status === 'running' ? (
                      <>
                        <ArrowPathIcon className="w-4 h-4 mr-1 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-4 h-4 mr-1" />
                        Run Tests
                      </>
                    )}
                  </button>
                </div>
              </div>

              {expandedSuites.includes(suite.id) && (
                <div className="mt-4 border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Last Run</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(suite.lastRun).toLocaleString()}
                      </p>
                    </div>
                    {suite.output && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Test Output</h4>
                        <pre className="mt-2 text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded">
                          {suite.output}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 