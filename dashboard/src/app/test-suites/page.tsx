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
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed' | 'warning' | 'completed with warnings';
  lastRun: string | null;
  duration: number | null;
  logContent?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
}

interface Device {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'busy';
  ipAddress: string;
}

const devices: Device[] = [
  { id: '1', name: 'Fire TV Stick 4K', status: 'active', ipAddress: '10.0.0.98' },
  { id: '2', name: 'Fire TV Cube', status: 'inactive', ipAddress: '192.168.1.102' },
  { id: '3', name: 'Fire TV Stick Lite', status: 'busy', ipAddress: '192.168.1.103' },
];

const testSuites: TestSuite[] = [
  {
    id: 'test:landing',
    name: 'Landing Page Tests',
    description: 'Verify landing page functionality',
    testCases: [
      {
        id: 'TC101',
        name: 'Verify Landing Page Loads Successfully',
        description: 'Check if the landing page loads with all elements',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC102',
        name: 'Verify Featured Content Carousel',
        description: 'Check if featured content carousel works correctly',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC103',
        name: 'Verify Navigation Menu Items',
        description: 'Check if navigation menu items are correct',
        status: 'idle',
        lastRun: null,
        duration: null,
      }
    ],
  },
  {
    id: 'test:navigation',
    name: 'Navigation Tests',
    description: 'Verify navigation and menu functionality',
    testCases: [
      {
        id: 'TC106',
        name: 'Main Menu Navigation',
        description: 'Verify main menu navigation functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC107',
        name: 'Search Functionality',
        description: 'Verify search functionality works correctly',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC108',
        name: 'Category Filtering',
        description: 'Verify category filtering works',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC109',
        name: 'Genre Selection',
        description: 'Verify genre selection functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC110',
        name: 'Profile Switching',
        description: 'Verify profile switching functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC111',
        name: 'Settings Menu',
        description: 'Verify settings menu navigation',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC112',
        name: 'Back Button Navigation',
        description: 'Verify back button functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC113',
        name: 'Home Button Navigation',
        description: 'Verify home button functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC114',
        name: 'Menu Shortcuts',
        description: 'Verify menu shortcuts work correctly',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC115',
        name: 'Content Browsing',
        description: 'Verify content browsing functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC116',
        name: 'Quick Menu Access',
        description: 'Verify quick menu access functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC117',
        name: 'Navigation History',
        description: 'Verify navigation history functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC118',
        name: 'Movie Titles Logging',
        description: 'Verify movie titles logging in Top Free Movies row',
        status: 'idle',
        lastRun: null,
        duration: null,
      }
    ],
  },
  {
    id: 'test:login',
    name: 'Login Tests',
    description: 'Verify login functionality',
    testCases: [
      {
        id: 'TC103',
        name: 'User Authentication Flow',
        description: 'Verify user authentication flow works correctly',
        status: 'idle',
        lastRun: null,
        duration: null,
      }
    ],
  },
  {
    id: 'test:series',
    name: 'Series Details Tests',
    description: 'Verify series details page functionality',
    testCases: [
      {
        id: 'TC119',
        name: 'Series Overview Page',
        description: 'Verify series overview page layout',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC120',
        name: 'Episode List Navigation',
        description: 'Verify episode list navigation',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC121',
        name: 'Season Selection',
        description: 'Verify season selection functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC122',
        name: 'Episode Details',
        description: 'Verify episode details display',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC123',
        name: 'Series Information',
        description: 'Verify series information display',
        status: 'idle',
        lastRun: null,
        duration: null,
      }
    ],
  },
  {
    id: 'test:playback',
    name: 'Playback Tests',
    description: 'Verify video playback functionality',
    testCases: [
      {
        id: 'TC201',
        name: 'Content Playback',
        description: 'Verify content playback functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC202',
        name: 'Series Playback and Pause',
        description: 'Verify series playback and pause functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC203',
        name: 'Forward Playback',
        description: 'Verify forward playback functionality',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC204',
        name: 'Audio Track Selection',
        description: 'Verify audio track selection',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC205',
        name: 'Ad Triggers',
        description: 'Verify ads trigger with multiple right keypresses',
        status: 'idle',
        lastRun: null,
        duration: null,
      }
    ],
  },
  {
    id: 'test:movies',
    name: 'Movies Details Tests',
    description: 'Verify movies details page functionality',
    testCases: [
      {
        id: 'TC124',
        name: 'Movie Details Page Layout',
        description: 'Verify movie details page layout',
        status: 'idle',
        lastRun: null,
        duration: null,
      },
      {
        id: 'TC125',
        name: 'Movie Playback Controls',
        description: 'Verify movie playback controls',
        status: 'idle',
        lastRun: null,
        duration: null,
      }
    ],
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

// Add this helper function near the other utility functions
const getTestSuiteStatus = (suite: TestSuite): 'passed' | 'failed' | 'running' | 'idle' => {
  if (suite.testCases.some(test => test.status === 'running')) return 'running';
  if (suite.testCases.length === 0) return 'idle';
  if (suite.testCases.every(test => test.status === 'passed')) return 'passed';
  if (suite.testCases.some(test => test.status === 'failed')) return 'failed';
  return 'idle';
};

export default function TestSuitesPage() {
  const router = useRouter();
  const [suites, setSuites] = useState<TestSuite[]>(testSuites);
  const [expandedSuites, setExpandedSuites] = useState<string[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Record<string, string>>({});
  const [expandedLogs, setExpandedLogs] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'state' | 'lastRun'>('name');
  const [runningSuites, setRunningSuites] = useState<string[]>([]);
  const [stoppingStates, setStoppingStates] = useState<Record<string, boolean>>({});
  const [currentTestIndex, setCurrentTestIndex] = useState<Record<string, number>>({});
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  // Sort function
  const sortSuites = (a: TestSuite, b: TestSuite): number => {
    switch (sortBy) {
      case 'name':
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      
      case 'state':
        const getStateWeight = (suite: TestSuite) => {
          if (suite.testCases.some(test => test.status === 'running')) return 1;
          if (suite.testCases.some(test => test.status === 'failed')) return 2;
          if (suite.testCases.some(test => test.status === 'passed')) return 3;
          return 4; // idle
        };
        const weightA = getStateWeight(a);
        const weightB = getStateWeight(b);
        return sortOrder === 'asc' ? weightA - weightB : weightB - weightA;
      
      case 'lastRun':
        const getLastRun = (suite: TestSuite) => {
          const lastRuns = suite.testCases
            .map(test => test.lastRun)
            .filter(date => date) as string[];
          return lastRuns.length ? Math.max(...lastRuns.map(date => new Date(date).getTime())) : 0;
        };
        const lastRunA = getLastRun(a);
        const lastRunB = getLastRun(b);
        return sortOrder === 'asc' ? lastRunA - lastRunB : lastRunB - lastRunA;
      
      default:
        return 0;
    }
  };

  // Sort the suites
  const sortedSuites = [...suites].sort(sortSuites);

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

  const runAllTests = async (suiteId: string) => {
    if (!selectedDevices[suiteId]) {
      alert('Please select a device first');
      return;
    }

    try {
      // Add to running suites and initialize progress
      setRunningSuites(prev => [...prev, suiteId]);
      setCurrentTestIndex(prev => ({ ...prev, [suiteId]: 0 }));

      const suite = suites.find(s => s.id === suiteId);
      if (!suite) return;

      // Set all tests in the suite to running state
      setSuites(prevSuites =>
        prevSuites.map(s =>
          s.id === suiteId
            ? {
                ...s,
                testCases: s.testCases.map(test => ({
                  ...test,
                  status: 'running',
                  logContent: 'Test execution started...'
                }))
              }
            : s
        )
      );

      // Start the actual test execution
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          options: { 
            suite: suiteId,
            device: selectedDevices[suiteId],
            testIds: suite.testCases.map(test => test.id)
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start test execution');
      }

    } catch (error) {
      console.error('Error running tests:', error);
      // Reset states on error
      setRunningSuites(prev => prev.filter(id => id !== suiteId));
      setCurrentTestIndex(prev => ({ ...prev, [suiteId]: 0 }));
      cleanup();

      setSuites(prevSuites =>
        prevSuites.map(s =>
          s.id === suiteId
            ? {
                ...s,
                testCases: s.testCases.map(test => ({
                  ...test,
                  status: 'failed',
                  logContent: error instanceof Error ? error.message : 'Failed to start test execution'
                }))
              }
            : s
        )
      );
    }
  };

  const runTest = async (suiteId: string, testId: string) => {
    if (!selectedDevices[suiteId]) {
      alert('Please select a device first');
      return;
    }

    // Clean up any existing intervals
    cleanup();

    try {
      // Update initial running state
      setSuites(prevSuites =>
        prevSuites.map(s =>
          s.id === suiteId
            ? {
                ...s,
                testCases: s.testCases.map(test =>
                  test.id === testId
                    ? { ...test, status: 'running', logContent: 'Test execution started...' }
                    : test
                )
              }
            : s
        )
      );

      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'run',
          options: {
            suite: suiteId,
            device: selectedDevices[suiteId],
            testIds: [testId]
          }
        })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Start polling for status
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch('/api/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'status',
            options: { suite: suiteId }
          })
        });

        const statusData = await statusResponse.json();
        console.log('Status update:', statusData);

        if (!statusData.isRunning) {
          clearInterval(pollInterval);
          
          // Check if the test passed based on exit code and output
          const testPassed = statusData.code === 0 || 
                           statusData.output?.includes('✅') || 
                           statusData.output?.includes('Test Completed Successfully') ||
                           statusData.output?.includes('All tests passed');
          
          // Update test case status based on actual test result
          setSuites(prevSuites =>
            prevSuites.map(s =>
              s.id === suiteId
                ? {
                    ...s,
                    testCases: s.testCases.map(test =>
                      test.id === testId
                        ? {
                            ...test,
                            status: testPassed ? 'passed' : 'failed',
                            lastRun: new Date().toISOString(),
                            logContent: statusData.output || 'No output available'
                          }
                        : test
                    )
                  }
                : s
            )
          );
        }
      }, 1000);

    } catch (error) {
      console.error('Error running test:', error);
      // Update state to show error
      setSuites(prevSuites =>
        prevSuites.map(s =>
          s.id === suiteId
            ? {
                ...s,
                testCases: s.testCases.map(test =>
                  test.id === testId
                    ? {
                        ...test,
                        status: 'failed',
                        lastRun: new Date().toISOString(),
                        logContent: error instanceof Error ? error.message : 'An unknown error occurred'
                      }
                    : test
                )
              }
            : s
        )
      );
    }
  };

  const stopTestExecution = async (suiteId: string) => {
    if (!confirm('Are you sure you want to stop the test execution? This will stop all running tests in this suite.')) {
      return;
    }

    try {
      // Set stopping state
      setStoppingStates(prev => ({ ...prev, [suiteId]: true }));

      // Call the API to stop test execution
      const response = await fetch('/api/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stop',
          options: { suite: suiteId }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to stop test execution');
      }

      // Force update UI state after stopping
      setSuites(prevSuites =>
        prevSuites.map(suite =>
          suite.id === suiteId
            ? {
                ...suite,
                testCases: suite.testCases.map(test => ({
                  ...test,
                  status: test.status === 'running' ? 'idle' : test.status,
                  logContent: test.logContent 
                    ? `${test.logContent}\nTest execution stopped by user.`
                    : 'Test execution stopped by user.'
                }))
              }
            : suite
        )
      );

      // Clear running states
      setRunningSuites(prev => prev.filter(id => id !== suiteId));
      setStoppingStates(prev => ({ ...prev, [suiteId]: false }));
      setCurrentTestIndex(prev => ({ ...prev, [suiteId]: 0 }));
      cleanup();

    } catch (error) {
      console.error('Error stopping test execution:', error);
      setStoppingStates(prev => ({ ...prev, [suiteId]: false }));
      
      // Show error in UI
      setSuites(prevSuites =>
        prevSuites.map(suite =>
          suite.id === suiteId
            ? {
                ...suite,
                testCases: suite.testCases.map(test => ({
                  ...test,
                  status: test.status === 'running' ? 'failed' : test.status,
                  logContent: test.logContent 
                    ? `${test.logContent}\nError stopping test: ${error instanceof Error ? error.message : 'Unknown error'}`
                    : `Error stopping test: ${error instanceof Error ? error.message : 'Unknown error'}`
                }))
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

  const toggleSuite = (suiteId: string) => {
    setExpandedSuites(prev =>
      prev.includes(suiteId)
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    );
  };

  const toggleLog = (testId: string) => {
    setExpandedLogs(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatLastRun = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Test Suites
          </h1>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'state' | 'lastRun')}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="state">State</option>
              <option value="lastRun">Latest Run</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              disabled={sortBy !== 'name'}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                sortBy !== 'name' 
                  ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <span>{sortOrder === 'asc' ? 'A → Z' : 'Z → A'}</span>
            </button>
          </div>
        </div>

        {/* Test Suites */}
        <div className="space-y-6">
          {sortedSuites.map((suite) => (
            <div
              key={suite.id}
              className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
            >
              {/* Suite Header */}
              <div className="p-6 flex items-center justify-between">
                <div 
                  className="cursor-pointer flex items-center flex-grow"
                  onClick={() => toggleSuite(suite.id)}
                >
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-semibold">{suite.name}</h2>
                      <div className={`px-2 py-0.5 text-xs font-medium rounded ${
                        getTestSuiteStatus(suite) === 'passed' ? 'bg-green-500/20 text-green-400' :
                        getTestSuiteStatus(suite) === 'failed' ? 'bg-red-500/20 text-red-400' :
                        getTestSuiteStatus(suite) === 'running' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {getTestSuiteStatus(suite).toUpperCase()}
                      </div>
                    </div>
                    <p className="text-gray-400">{suite.description}</p>
                  </div>
                  {expandedSuites.includes(suite.id) ? (
                    <ChevronDownIcon className="w-6 h-6 ml-4" />
                  ) : (
                    <ChevronRightIcon className="w-6 h-6 ml-4" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Device Selection Dropdown */}
                  <select
                    value={selectedDevices[suite.id] || ''}
                    onChange={(e) => setSelectedDevices(prev => ({
                      ...prev,
                      [suite.id]: e.target.value
                    }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Device</option>
                    {devices.map((device) => (
                      <option 
                        key={device.id} 
                        value={device.id}
                        disabled={device.status !== 'active'}
                        className="text-black"
                      >
                        {`${device.name} (${device.ipAddress})`}
                      </option>
                    ))}
                  </select>

                  {/* Run/Stop Controls */}
                  <div className="flex items-center space-x-2">
                    {/* Run All Tests Button */}
                    <button
                      onClick={() => runAllTests(suite.id)}
                      disabled={!selectedDevices[suite.id] || runningSuites.includes(suite.id)}
                      className={`px-6 py-2 rounded-lg ${
                        runningSuites.includes(suite.id)
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } transition-colors flex items-center space-x-2`}
                    >
                      {runningSuites.includes(suite.id) ? (
                        <>
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          <span>Running Tests...</span>
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-5 h-5" />
                          <span>Run All Tests</span>
                        </>
                      )}
                    </button>

                    {/* Stop Tests Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        stopTestExecution(suite.id);
                      }}
                      disabled={!runningSuites.includes(suite.id) || stoppingStates[suite.id]}
                      className={`px-6 py-2 rounded-lg ${
                        stoppingStates[suite.id]
                          ? 'bg-gray-500 cursor-not-allowed'
                          : runningSuites.includes(suite.id)
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                      } transition-colors flex items-center space-x-2`}
                    >
                      {stoppingStates[suite.id] ? (
                        <>
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          <span>Stopping...</span>
                        </>
                      ) : (
                        <>
                          <StopIcon className="w-5 h-5" />
                          <span>Stop Tests</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Test Cases */}
              {expandedSuites.includes(suite.id) && (
                <div className="border-t border-white/10">
                  {suite.testCases.map((test, index) => (
                    <div key={test.id} className="p-6 border-b border-white/10 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-medium">{test.id} - {test.name}</h3>
                            <div className={`px-2 py-0.5 text-xs font-medium rounded ${
                              test.status === 'passed' ? 'bg-green-500/20 text-green-400' :
                              test.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                              test.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {test.status.toUpperCase()}
                            </div>
                          </div>
                          <p className="text-sm text-gray-400">{test.description}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          {/* Run Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!selectedDevices[suite.id]) {
                                alert('Please select a device first');
                                return;
                              }
                              runTest(suite.id, test.id);
                            }}
                            disabled={runningSuites.includes(suite.id) || !selectedDevices[suite.id]}
                            className={`px-4 py-2 rounded-lg ${
                              runningSuites.includes(suite.id) || !selectedDevices[suite.id]
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                            } transition-colors flex items-center space-x-2`}
                          >
                            {test.status === 'running' ? (
                              <>
                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                <span>Running...</span>
                              </>
                            ) : (
                              <>
                                <PlayIcon className="w-4 h-4" />
                                <span>Run</span>
                              </>
                            )}
                          </button>

                          {/* Stop Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              stopTestExecution(suite.id);
                            }}
                            disabled={test.status !== 'running' || stoppingStates[suite.id]}
                            className={`px-4 py-2 rounded-lg ${
                              stoppingStates[suite.id]
                                ? 'bg-gray-500 cursor-not-allowed'
                                : test.status === 'running'
                                ? 'bg-red-500 hover:bg-red-600'
                                : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                            } transition-colors flex items-center space-x-2`}
                          >
                            {stoppingStates[suite.id] ? (
                              <>
                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                <span>Stopping...</span>
                              </>
                            ) : (
                              <>
                                <StopIcon className="w-4 h-4" />
                                <span>Stop</span>
                              </>
                            )}
                          </button>

                          {/* Progress Bar */}
                          {runningSuites.includes(suite.id) && currentTestIndex[suite.id] === index && test.status === 'running' && (
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-500 animate-pulse"
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Duration */}
                          <div className="text-gray-400">
                            {formatDuration(test.duration)}
                          </div>

                          {/* Log Button */}
                          <button
                            onClick={() => toggleLog(test.id)}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            Logs
                          </button>

                          {/* Last Run */}
                          <div className="text-sm text-gray-400">
                            Last Run: {formatLastRun(test.lastRun)}
                          </div>
                        </div>
                      </div>

                      {/* Log Content */}
                      {expandedLogs.includes(test.id) && (
                        <div className="mt-4 p-4 rounded-lg bg-black/50 font-mono text-sm">
                          {test.logContent || 'No logs available'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 