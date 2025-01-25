'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
import { TestExecutionService } from '@/services/testExecutionService';
import { testSuites, devices } from '@/config/testConfig';
import type { TestSuite, TestCase, Device } from '@/types/testTypes';
import type { TestExecutionResponse } from '@/types/testTypes';

function formatTestOutput(data: Record<string, any>): string {
  if (!data) return '';
  return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
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
  const pathname = usePathname();
  const [suites, setSuites] = useState<TestSuite[]>(() => {
    // Initialize with default state for both server and client
    const defaultState = testSuites.map(suite => ({
      ...suite,
      testCases: suite.testCases.map(test => ({
        ...test,
        status: 'idle',
        lastRun: null,
        duration: null,
        logContent: ''
      }))
    }));

    // Only try to load from localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const persistedTestStates = localStorage.getItem('testStates');
        if (persistedTestStates) {
          const states = JSON.parse(persistedTestStates);
          return defaultState.map(suite => ({
            ...suite,
            testCases: suite.testCases.map(test => ({
              ...test,
              status: states[`${suite.id}-${test.id}`]?.status || 'idle',
              lastRun: states[`${suite.id}-${test.id}`]?.lastRun || null,
              duration: states[`${suite.id}-${test.id}`]?.duration || null,
              logContent: states[`${suite.id}-${test.id}`]?.logContent || ''
            }))
          }));
        }
      } catch (error) {
        console.error('Error loading initial state:', error);
      }
    }
    
    return defaultState;
  });
  const [expandedSuites, setExpandedSuites] = useState<string[]>(() => {
    try {
      const persisted = localStorage.getItem('expandedSuites');
      return persisted ? JSON.parse(persisted) : [];
    } catch (error) {
      return [];
    }
  });
  const [selectedDevices, setSelectedDevices] = useState<Record<string, string>>(() => {
    try {
      const persisted = localStorage.getItem('selectedDevices');
      return persisted ? JSON.parse(persisted) : {};
    } catch (error) {
      return {};
    }
  });
  const [expandedLogs, setExpandedLogs] = useState<string[]>(() => {
    try {
      const persisted = localStorage.getItem('expandedLogs');
      return persisted ? JSON.parse(persisted) : [];
    } catch (error) {
      return [];
    }
  });
  const [runningSuites, setRunningSuites] = useState<string[]>(() => {
    try {
      const persisted = localStorage.getItem('runningSuites');
      return persisted ? JSON.parse(persisted) : [];
    } catch (error) {
      return [];
    }
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'name' | 'state' | 'lastRun'>('name');
  const [stoppingStates, setStoppingStates] = useState<Record<string, boolean>>({});
  const [currentTestIndex, setCurrentTestIndex] = useState<Record<string, number>>({});
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Start status check on mount
  useEffect(() => {
    startStatusCheck();
    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('selectedDevices', JSON.stringify(selectedDevices));
  }, [selectedDevices]);

  useEffect(() => {
    localStorage.setItem('runningSuites', JSON.stringify(runningSuites));
  }, [runningSuites]);

  useEffect(() => {
    localStorage.setItem('expandedSuites', JSON.stringify(expandedSuites));
  }, [expandedSuites]);

  useEffect(() => {
    localStorage.setItem('expandedLogs', JSON.stringify(expandedLogs));
  }, [expandedLogs]);

  useEffect(() => {
    // Persist test states
    const testStates: Record<string, any> = {};
    suites.forEach(suite => {
      suite.testCases.forEach(test => {
        testStates[`${suite.id}-${test.id}`] = {
          status: test.status,
          lastRun: test.lastRun,
          duration: test.duration,
          logContent: test.logContent,
        };
      });
    });
    localStorage.setItem('testStates', JSON.stringify(testStates));
  }, [suites]);

  // Start periodic status check
  const startStatusCheck = () => {
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
    }

    statusCheckInterval.current = setInterval(async () => {
      // Only check if there are running tests
      if (runningSuites.length === 0) {
        if (statusCheckInterval.current) {
          clearInterval(statusCheckInterval.current);
          statusCheckInterval.current = null;
        }
        return;
      }

      const testService = new TestExecutionService();
      
      // Check status for each running suite
      for (const suiteId of runningSuites) {
        try {
          const deviceId = selectedDevices[suiteId];
          if (!deviceId) {
            // Remove from running suites if no device is selected
            setRunningSuites(prev => prev.filter(id => id !== suiteId));
            continue;
          }

          const device = devices.find(d => d.id === deviceId);
          if (!device) {
            // Remove from running suites if device not found
            setRunningSuites(prev => prev.filter(id => id !== suiteId));
            continue;
          }

          // Only check device status if there are actually running tests in the suite
          const suite = suites.find(s => s.id === suiteId);
          if (!suite?.testCases.some(test => test.status === 'running')) {
            setRunningSuites(prev => prev.filter(id => id !== suiteId));
            continue;
          }

          try {
            // Check device connection
            const deviceStatus = await testService.getDeviceStatus(deviceId);
            if (!deviceStatus.connected) {
              // Update suite status if device is disconnected
              setSuites(prevSuites =>
                prevSuites.map(suite =>
                  suite.id === suiteId
                    ? {
                        ...suite,
                        testCases: suite.testCases.map(test => ({
                          ...test,
                          status: test.status === 'running' ? 'failed' : test.status,
                          logContent: test.logContent + '\nDevice disconnected during test execution.'
                        }))
                      }
                    : suite
                )
              );
              setRunningSuites(prev => prev.filter(id => id !== suiteId));
            }
          } catch (error) {
            // If device status check fails, don't update the UI
            console.warn(`Could not check status for device ${deviceId}:`, error);
          }
        } catch (error) {
          console.error(`Error checking status for suite ${suiteId}:`, error);
        }
      }
    }, 10000); // Check every 10 seconds
  };

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
            .map(test => test.lastRun ? new Date(test.lastRun).getTime() : 0)
            .filter(timestamp => timestamp > 0);
          return lastRuns.length ? Math.max(...lastRuns) : 0;
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

  // Clean up function
  const cleanup = () => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
    if (statusCheckInterval.current) {
      clearInterval(statusCheckInterval.current);
      statusCheckInterval.current = null;
    }
  };

  // Add the updateTestCaseStatuses function
  const updateTestCaseStatuses = (
    suiteId: string, 
    status: 'passed' | 'failed' | 'running' | 'idle' | 'stopped',
    message?: string
  ) => {
    setSuites(prevSuites =>
      prevSuites.map(s =>
        s.id === suiteId
          ? {
              ...s,
              testCases: s.testCases.map(test => ({
                ...test,
                status,
                logContent: message ? `${test.logContent || ''}\n${message}` : test.logContent
              }))
            }
          : s
      )
    );
  };

  const runAllTests = async (suiteId: string) => {
    const deviceId = selectedDevices[suiteId];
    if (!deviceId) {
      console.error('No device selected for suite:', suiteId);
      return;
    }

    const device = devices.find(d => d.id === deviceId);
    if (!device) {
      console.error('Selected device not found:', deviceId);
      return;
    }

    try {
      setRunningSuites(prev => [...prev, suiteId]);
      const testService = new TestExecutionService();
      const result = await testService.executeSuite({
        suiteId,
        deviceId,
        deviceIp: device.ipAddress,
        mode: 'suite'
      });

      if (!result.success) {
        console.error('Test execution failed:', result.errors);
        updateTestCaseStatuses(suiteId, 'failed', result.errors || 'Test execution failed');
      }
    } catch (error: any) {
      console.error('Error running tests:', error);
      updateTestCaseStatuses(suiteId, 'failed', error.message);
    } finally {
      setRunningSuites(prev => prev.filter(id => id !== suiteId));
    }
  };

  const runTest = async (suiteId: string, testId: string) => {
    try {
      const deviceId = selectedDevices[suiteId];
      if (!deviceId) {
        console.error('No device selected');
        return;
      }

      const device = devices.find(d => d.id === deviceId);
      if (!device) {
        console.error('Selected device not found');
        return;
      }

      // Update UI state
      setRunningSuites(prev => [...prev, suiteId]);
      
      // Update test state to running
      setSuites(prevSuites =>
        prevSuites.map(s =>
          s.id === suiteId
            ? {
                ...s,
                testCases: s.testCases.map(test => ({
                  ...test,
                  status: test.id === testId ? 'running' : test.status,
                  lastRun: test.id === testId ? new Date().toISOString() : test.lastRun
                }))
              }
            : s
        )
      );

      // Start test execution
      const testService = new TestExecutionService();
      const result = await testService.executeTest({
        suiteId,
        testId,
        deviceId,
        deviceIp: device.ipAddress,
        mode: 'single'
      }) as TestExecutionResponse;

      // Update test state based on result
      setSuites(prevSuites =>
        prevSuites.map(s =>
          s.id === suiteId
            ? {
                ...s,
                testCases: s.testCases.map(test => ({
                  ...test,
                  status: test.id === testId ? (result.success ? 'passed' : 'failed') : test.status,
                  logContent: test.id === testId ? result.output : test.logContent
                }))
              }
            : s
        )
      );

      // Only remove from running suites if all tests in the suite are complete
      const updatedSuite = suites.find(s => s.id === suiteId);
      if (updatedSuite && !updatedSuite.testCases.some(test => test.status === 'running')) {
        setRunningSuites(prev => prev.filter(id => id !== suiteId));
      }

    } catch (error) {
      console.error('Failed to run test:', error);
      
      // Update UI state on error
      setSuites(prevSuites =>
        prevSuites.map(s =>
          s.id === suiteId
            ? {
                ...s,
                testCases: s.testCases.map(test => ({
                  ...test,
                  status: test.id === testId ? 'failed' : test.status,
                  logContent: test.id === testId ? `${test.logContent || ''}\nError: ${error}` : test.logContent
                }))
              }
            : s
        )
      );

      // Only remove from running suites if all tests in the suite are complete
      const updatedSuite = suites.find(s => s.id === suiteId);
      if (updatedSuite && !updatedSuite.testCases.some(test => test.status === 'running')) {
        setRunningSuites(prev => prev.filter(id => id !== suiteId));
      }
    }
  };

  const stopTestExecution = async (suiteId: string) => {
    if (!confirm('Are you sure you want to stop the test execution? This will stop all running tests in this suite.')) {
      return;
    }

    try {
      // Set stopping state
      setStoppingStates(prev => ({ ...prev, [suiteId]: true }));

      // Call the test service to stop execution
      const testService = new TestExecutionService();
      await testService.stopExecution({
        suiteId,
        deviceId: selectedDevices[suiteId],
        mode: 'suite'
      });

      // Force update UI state after stopping
      setSuites(prevSuites =>
        prevSuites.map(suite =>
          suite.id === suiteId
            ? {
                ...suite,
                testCases: suite.testCases.map(test => ({
                  ...test,
                  status: test.status === 'running' ? 'stopped' : test.status,
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

  const formatDuration = (seconds: number | null | undefined): string => {
    if (seconds == null) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatLastRun = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const handleTestClick = (test: TestCase, suiteId: string) => {
    if (test.status === 'running') {
      stopTestExecution(suiteId);
    } else {
      runTest(suiteId, test.id);
    }
  };

  const handleSuiteClick = (suiteId: string) => {
    // ... existing code ...
  };

  const handleDeviceSelect = (deviceId: string, suiteId: string) => {
    setSelectedDevices(prev => ({
      ...prev,
      [suiteId]: deviceId
    }));
  };

  const handleLogClick = (testId: string) => {
    // ... existing code ...
  };

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  const renderDeviceSelector = (suiteId: string) => {
    return (
      <select
        value={selectedDevices[suiteId] || ''}
        onChange={(e) => handleDeviceSelect(e.target.value, suiteId)}
        className="ml-4 rounded-md py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm bg-white/5 border border-white/10 text-white"
        style={{ colorScheme: 'dark' }}
      >
        <option value="" className="bg-gray-800 text-white">Select Device</option>
        {devices.map((device: Device) => (
          <option 
            key={device.id} 
            value={device.id}
            disabled={device.status !== 'active'}
            className="bg-gray-800 text-white"
            style={{ 
              backgroundColor: '#1f2937',
              color: device.status === 'active' ? 'white' : '#9ca3af'
            }}
          >
            {device.name} ({device.ipAddress}) {device.status !== 'active' ? '- ' + device.status : ''}
          </option>
        ))}
      </select>
    );
  };

  const renderTestCase = (test: TestCase, index: number, suiteId: string) => {
    return (
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
                if (!selectedDevices[suiteId]) {
                  alert('Please select a device first');
                  return;
                }
                runTest(suiteId, test.id);
              }}
              disabled={runningSuites.includes(suiteId) || !selectedDevices[suiteId]}
              className={`px-4 py-2 rounded-lg ${
                runningSuites.includes(suiteId) || !selectedDevices[suiteId]
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

            {/* Runtime */}
            <div className="text-sm text-gray-400">
              Runtime: {renderTestDuration(test)}
            </div>

            {/* Stop Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                stopTestExecution(suiteId);
              }}
              disabled={test.status !== 'running' || stoppingStates[suiteId]}
              className={`px-4 py-2 rounded-lg ${
                stoppingStates[suiteId]
                  ? 'bg-gray-500 cursor-not-allowed'
                  : test.status === 'running'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
              } transition-colors flex items-center space-x-2`}
            >
              {test.status === 'running' ? (
                <>
                  <StopIcon className="w-4 h-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <StopIcon className="w-4 h-4" />
                  <span>Stopped</span>
                </>
              )}
            </button>

            {/* Logs Button */}
            <button
              onClick={() => toggleLog(test.id)}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center space-x-2"
            >
              {expandedLogs.includes(test.id) ? (
                <ChevronDownIcon className="w-4 h-4" />
              ) : (
                <ChevronRightIcon className="w-4 h-4" />
              )}
              <span>Logs</span>
            </button>
          </div>
        </div>

        {/* Logs Panel */}
        {expandedLogs.includes(test.id) && test.logContent && (
          <div className="mt-4">
            <pre className="p-4 rounded-lg bg-black/50 text-sm font-mono overflow-x-auto">
              {test.logContent}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const handleTestExecution = async (test: TestCase, suiteId: string) => {
    try {
      const deviceId = selectedDevices[suiteId];
      if (!deviceId) {
        console.error('No device selected');
        return;
      }

      const device = devices.find((d: Device) => d.id === deviceId);
      if (!device) {
        console.error('Selected device not found');
        return;
      }

      // ... rest of the function
    } catch (error) {
      console.error('Test execution failed:', error);
    }
  };

  const handleSuiteExecution = async (suite: TestSuite) => {
    try {
      const deviceId = selectedDevices[suite.id];
      if (!deviceId) {
        console.error('No device selected');
        return;
      }

      const device = devices.find((d: Device) => d.id === deviceId);
      if (!device) {
        console.error('Selected device not found');
        return;
      }

      // ... rest of the function
    } catch (error) {
      console.error('Suite execution failed:', error);
    }
  };

  const renderTestStatus = (test: TestCase) => {
    const statusColors = {
      idle: 'bg-gray-100 text-gray-800',
      running: 'bg-blue-100 text-blue-800',
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      stopped: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[test.status]}`}>
        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
      </span>
    );
  };

  const renderTestDuration = (test: TestCase) => {
    if (!test.duration) return 'N/A';
    return `${test.duration}s`;
  };

  const renderLastRun = (test: TestCase) => {
    return formatDate(test.lastRun);
  };

  const updateTestStatus = (suiteId: string, testId: string, updates: Partial<TestCase>) => {
    setSuites(prevSuites =>
      prevSuites.map(suite =>
        suite.id === suiteId
          ? {
              ...suite,
              testCases: suite.testCases.map(test =>
                test.id === testId
                  ? { ...test, ...updates }
                  : test
              )
            }
          : suite
      )
    );
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
                    <ChevronDownIcon className="w-6 h-6 mr-14" />
                  ) : (
                    <ChevronRightIcon className="w-6 h-6 mr-14" />
                  )}
                </div>
                
                <div className="flex items-center space-x-20">
                  {/* Device Selection Dropdown */}
                  {renderDeviceSelector(suite.id)}

                  {/* Run/Stop Controls */}
                  <div className="flex items-center space-x-20">
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
                  {suite.testCases.map((test, index) => renderTestCase(test, index, suite.id))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}