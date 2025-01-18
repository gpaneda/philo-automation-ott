'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BeakerIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  SignalIcon,
  ExclamationCircleIcon,
  WifiIcon,
  ComputerDesktopIcon,
  InformationCircleIcon,
  PhotoIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

// Using the same mock data structure
const testSuites = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
    name: 'Navigation Tests',
    description: 'Core navigation and menu interaction tests',
    totalTests: 12,
    passedTests: 8,
    failedTests: 0,
    status: 'running',
    lastRun: new Date(Date.now() - 1800000).toISOString(),
    runningTests: ['TC106', 'TC107'],
  },
  {
    id: '4',
    name: 'Playback Tests',
    description: 'Video playback and player controls testing',
    totalTests: 5,
    passedTests: 5,
    failedTests: 0,
    status: 'passed',
    lastRun: new Date(Date.now() - 5400000).toISOString(),
    runningTests: [],
  },
  {
    id: '5',
    name: 'Series Details Tests',
    description: 'TV series details and episode navigation tests',
    totalTests: 5,
    passedTests: 3,
    failedTests: 0,
    status: 'running',
    lastRun: new Date(Date.now() - 900000).toISOString(),
    runningTests: [],
  },
  {
    id: '6',
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

// Test case mapping with mutable state
const testCaseMapping = {
  '1': [ // Landing Page Tests
    { id: 'TC101', name: 'Verify Landing Page Loads Successfully', status: 'passed' },
    { id: 'TC102', name: 'Verify Featured Content Carousel', status: 'passed' },
    { id: 'TC103', name: 'Verify Navigation Menu Items', status: 'passed' }
  ],
  '2': [ // Movies Details Tests
    { id: 'TC124', name: 'Verify Movie Details Page Layout', status: 'passed' },
    { id: 'TC125', name: 'Verify Movie Playback Controls', status: 'failed' }
  ],
  '3': [ // Navigation Tests
    { id: 'TC106', name: 'Verify Main Menu Navigation', status: 'running' },
    { id: 'TC107', name: 'Verify Search Functionality', status: 'running' },
    { id: 'TC108', name: 'Verify Category Filtering', status: 'pending' },
    { id: 'TC109', name: 'Verify Filter Menu Interactions', status: 'passed' },
    { id: 'TC110', name: 'Verify Sort Options', status: 'passed' },
    { id: 'TC111', name: 'Verify Breadcrumb Navigation', status: 'passed' },
    { id: 'TC112', name: 'Verify Genre Selection', status: 'passed' },
    { id: 'TC113', name: 'Verify Watch List Navigation', status: 'passed' },
    { id: 'TC114', name: 'Verify Continue Watching Section', status: 'passed' },
    { id: 'TC115', name: 'Verify Profile Switching', status: 'passed' },
    { id: 'TC116', name: 'Verify Settings Menu Navigation', status: 'passed' },
    { id: 'TC117', name: 'Verify Back Button Functionality', status: 'passed' }
  ],
  '4': [ // Playback Tests
    { id: 'TC201', name: 'Verify Video Quality Selection', status: 'passed' },
    { id: 'TC202', name: 'Verify Playback Controls', status: 'passed' },
    { id: 'TC203', name: 'Verify Closed Captions', status: 'passed' },
    { id: 'TC204', name: 'Verify Audio Track Selection', status: 'passed' },
    { id: 'TC205', name: 'Verify Playback Resume', status: 'passed' }
  ],
  '5': [ // Series Details Tests
    { id: 'TC301', name: 'Verify Series Overview Page', status: 'passed' },
    { id: 'TC302', name: 'Verify Episode List Display', status: 'passed' },
    { id: 'TC303', name: 'Verify Season Navigation', status: 'passed' },
    { id: 'TC304', name: 'Verify Episode Details', status: 'running' },
    { id: 'TC305', name: 'Verify Series Metadata', status: 'running' }
  ],
  '6': [ // Login Tests
    { id: 'TC401', name: 'Verify User Authentication Flow', status: 'passed' }
  ]
};

// Enhanced device options
const deviceOptions = [
  { 
    id: 'fire-tv-stick', 
    name: 'Fire TV Stick', 
    status: 'online', 
    lastSeen: new Date(),
    healthStatus: 'good',
    connectionStrength: 95,
    lastSuccessfulRun: new Date(Date.now() - 1800000),
    osVersion: '7.2.1.3',
    ipAddress: '192.168.1.101'
  },
  { 
    id: 'fire-tv-cube', 
    name: 'Fire TV Cube', 
    status: 'online', 
    lastSeen: new Date(),
    healthStatus: 'warning',
    connectionStrength: 75,
    lastSuccessfulRun: new Date(Date.now() - 3600000),
    osVersion: '7.2.1.3',
    ipAddress: '192.168.1.102'
  },
  { 
    id: 'fire-tv-4k', 
    name: 'Fire TV 4K', 
    status: 'offline', 
    lastSeen: new Date(Date.now() - 3600000),
    healthStatus: 'error',
    connectionStrength: 0,
    lastSuccessfulRun: new Date(Date.now() - 86400000),
    osVersion: '7.2.1.2',
    ipAddress: '192.168.1.103'
  },
  { 
    id: 'fire-tv-smart-tv', 
    name: 'Fire TV Smart TV', 
    status: 'online', 
    lastSeen: new Date(),
    healthStatus: 'good',
    connectionStrength: 100,
    lastSuccessfulRun: new Date(Date.now() - 7200000),
    osVersion: '7.2.1.3',
    ipAddress: '192.168.1.104'
  }
];

// Add test execution states
const TEST_STATES = {
  QUEUED: 'queued',
  INITIALIZING: 'initializing',
  RUNNING: 'running',
  ANALYZING: 'analyzing',
  PASSED: 'passed',
  FAILED: 'failed',
  STOPPED: 'stopped'
};

export default function TestSuites() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [suites, setSuites] = useState(testSuites);
  const [expandedSuites, setExpandedSuites] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState(deviceOptions[0].id);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [currentSuiteIndex, setCurrentSuiteIndex] = useState(0);
  const [suiteDevices, setSuiteDevices] = useState(
    testSuites.reduce((acc, suite) => ({ ...acc, [suite.id]: deviceOptions[0].id }), {})
  );
  const [viewMode, setViewMode] = useState('expanded'); // or 'compact'
  const [executionMode, setExecutionMode] = useState('parallel'); // or 'sequential'
  const [runningTestsProgress, setRunningTestsProgress] = useState({});
  const [selectedDeviceDetails, setSelectedDeviceDetails] = useState(null);
  const [expandedTestDetails, setExpandedTestDetails] = useState<string[]>([]);
  const [deviceIPs, setDeviceIPs] = useState({});
  const [sortOption, setSortOption] = useState('lastRun'); // 'alphabetical', 'lastRun', 'status', 'passRate'

  useEffect(() => {
    const pollDeviceIPs = async () => {
      const onlineDevices = deviceOptions.filter(d => d.status === 'online');
      const ips = {};
      
      for (const device of onlineDevices) {
        try {
          // In real implementation, this would be an actual API call to get device IP
          const response = await fetch(`http://${device.ipAddress}:3001/status`);
          if (response.ok) {
            ips[device.id] = device.ipAddress;
          } else {
            ips[device.id] = 'Unreachable';
          }
        } catch (error) {
          console.error(`Failed to get IP for device ${device.id}:`, error);
          ips[device.id] = 'Unreachable';
        }
      }
      
      setDeviceIPs(ips);
    };

    // Poll every 30 seconds
    pollDeviceIPs();
    const interval = setInterval(pollDeviceIPs, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSortedSuites = (suites) => {
    return [...suites].sort((a, b) => {
      switch (sortOption) {
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        case 'lastRun':
          return new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime();
        case 'status':
          return b.status.localeCompare(a.status);
        case 'passRate':
          const aPassRate = (a.passedTests / a.totalTests) * 100;
          const bPassRate = (b.passedTests / b.totalTests) * 100;
          return bPassRate - aPassRate;
        default:
          return 0;
      }
    });
  };

  const filteredSuites = getSortedSuites(
    suites.filter(suite => {
      const matchesSearch = suite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           suite.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || suite.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <PlayIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const updateTestProgress = (suiteId, testId, progress) => {
    setRunningTestsProgress(prev => ({
      ...prev,
      [suiteId]: {
        ...prev[suiteId],
        [testId]: progress
      }
    }));
  };

  const getTestStatusIcon = (status: string, progress = 0) => {
    switch (status) {
      case TEST_STATES.PASSED:
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case TEST_STATES.FAILED:
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case TEST_STATES.RUNNING:
        return (
          <div className="relative">
            <PlayIcon className="h-4 w-4 text-yellow-500" />
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gray-200 rounded">
              <div 
                className="h-full bg-yellow-500 rounded" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      case TEST_STATES.QUEUED:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
      case TEST_STATES.INITIALIZING:
        return <ArrowPathIcon className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-200" />;
    }
  };

  const handleRunSuite = async (suiteId: string, deviceId: string) => {
    console.log(`Running suite ${suiteId} on device ${deviceId}`);
    
    // Check device status
    const device = deviceOptions.find(d => d.id === deviceId);
    if (device?.status === 'offline') {
      alert(`Device ${device.name} is offline. Please select another device.`);
      return;
    }

    // Update suite status
    setSuites(prevSuites => 
      prevSuites.map(suite => {
        if (suite.id === suiteId) {
          const testIds = testCaseMapping[suiteId]?.map(test => test.id) || [];
          return { 
            ...suite, 
            status: TEST_STATES.INITIALIZING,
            runningTests: testIds,
            device: deviceId,
            startTime: new Date()
          };
        }
        return suite;
      })
    );

    // Initialize test cases
    const testCases = testCaseMapping[suiteId];
    if (testCases) {
      if (executionMode === 'sequential') {
        for (const test of testCases) {
          test.status = TEST_STATES.QUEUED;
        }
        // Start first test
        if (testCases.length > 0) {
          await runTest(suiteId, testCases[0].id, deviceId);
        }
      } else {
        // Parallel execution
        testCases.forEach(test => {
          test.status = TEST_STATES.INITIALIZING;
          runTest(suiteId, test.id, deviceId);
        });
      }
    }
  };

  const runTest = async (suiteId: string, testId: string, deviceId: string) => {
    const test = testCaseMapping[suiteId]?.find(t => t.id === testId);
    if (!test) return;

    test.status = TEST_STATES.INITIALIZING;
    test.startTime = new Date();

    // Simulate test execution with progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      updateTestProgress(suiteId, testId, progress);
    }

    test.status = Math.random() > 0.8 ? TEST_STATES.FAILED : TEST_STATES.PASSED;
    test.endTime = new Date();
    test.duration = test.endTime - test.startTime;

    // If sequential, start next test
    if (executionMode === 'sequential') {
      const testCases = testCaseMapping[suiteId];
      const currentIndex = testCases.findIndex(t => t.id === testId);
      if (currentIndex < testCases.length - 1) {
        await runTest(suiteId, testCases[currentIndex + 1].id, deviceId);
      }
    }
  };

  const handleRunFailedTests = (suiteId: string) => {
    setSuites(prevSuites => 
      prevSuites.map(suite => {
        if (suite.id === suiteId && suite.failedTests > 0) {
          return { 
            ...suite, 
            status: TEST_STATES.RUNNING,
            runningTests: ['TC125'] // In real app, this would be actual failed test IDs
          };
        }
        return suite;
      })
    );
  };

  const handleStopRun = (suiteId: string) => {
    // Update the suite status
    setSuites(prevSuites => 
      prevSuites.map(suite => 
        suite.id === suiteId 
          ? { ...suite, status: TEST_STATES.STOPPED, runningTests: [] }
          : suite
      )
    );

    // Update all test cases in the suite to stopped status
    const testCases = testCaseMapping[suiteId];
    if (testCases) {
      testCases.forEach(test => {
        test.status = TEST_STATES.PASSED; // Default to passed when stopped, in real app this would be the actual result
      });
    }
  };

  const toggleSuiteExpansion = (suiteId: string) => {
    setExpandedSuites(prev => 
      prev.includes(suiteId) 
        ? prev.filter(id => id !== suiteId)
        : [...prev, suiteId]
    );
  };

  const handleRunTest = (suiteId: string, testId: string) => {
    // Update the suite's running tests
    setSuites(prevSuites => 
      prevSuites.map(suite => {
        if (suite.id === suiteId) {
          return {
            ...suite,
            status: TEST_STATES.RUNNING,
            runningTests: [...suite.runningTests, testId]
          };
        }
        return suite;
      })
    );

    // Update the test case status in the mapping
    const testCases = testCaseMapping[suiteId];
    if (testCases) {
      const testIndex = testCases.findIndex(test => test.id === testId);
      if (testIndex !== -1) {
        testCases[testIndex] = {
          ...testCases[testIndex],
          status: TEST_STATES.RUNNING
        };
      }
    }
  };

  const handleStopTest = (suiteId: string, testId: string) => {
    // Update the suite's running tests
    setSuites(prevSuites => 
      prevSuites.map(suite => {
        if (suite.id === suiteId) {
          const updatedRunningTests = suite.runningTests.filter(id => id !== testId);
          return {
            ...suite,
            runningTests: updatedRunningTests,
            // If no more running tests, update suite status
            status: updatedRunningTests.length === 0 ? TEST_STATES.PASSED : TEST_STATES.RUNNING
          };
        }
        return suite;
      })
    );

    // Update the test case status in the mapping
    const testCases = testCaseMapping[suiteId];
    if (testCases) {
      const testIndex = testCases.findIndex(test => test.id === testId);
      if (testIndex !== -1) {
        testCases[testIndex] = {
          ...testCases[testIndex],
          status: TEST_STATES.PASSED // Default to passed when stopped, in real app this would be the actual result
        };
      }
    }
  };

  const handleRunAllSuites = () => {
    setIsRunningAll(true);
    setCurrentSuiteIndex(0);
    
    // Start with the first suite
    const runNextSuite = (index) => {
      if (index < testSuites.length) {
        const suite = testSuites[index];
        handleRunSuite(suite.id, suiteDevices[suite.id]);
        
        // Simulate suite completion after 3 seconds (replace with actual test execution)
        setTimeout(() => {
          handleStopRun(suite.id);
          setCurrentSuiteIndex(index + 1);
          runNextSuite(index + 1);
        }, 3000);
      } else {
        setIsRunningAll(false);
        setCurrentSuiteIndex(0);
      }
    };

    runNextSuite(0);
  };

  const handleDeviceChange = (suiteId: string, deviceId: string) => {
    setSuiteDevices(prev => ({
      ...prev,
      [suiteId]: deviceId
    }));
  };

  const getConnectionStrength = (strength: number) => {
    if (strength === 0) return null;
    return (
      <div className="flex items-center">
        <WifiIcon 
          className={`h-4 w-4 ${
            strength > 80 ? 'text-green-500' : 
            strength > 50 ? 'text-yellow-500' : 
            'text-red-500'
          }`} 
        />
        <span className="ml-1 text-xs">{strength}%</span>
      </div>
    );
  };

  const toggleTestDetails = (testId: string) => {
    setExpandedTestDetails(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Suites</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and run your test suites
        </p>
      </div>

      {/* Enhanced Global Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                className="px-4 py-2 border border-gray-300 rounded-md pr-12"
                value={selectedDevice}
                onChange={(e) => {
                  setSelectedDevice(e.target.value);
                  setSelectedDeviceDetails(null);
                }}
              >
                {deviceOptions.map(device => (
                  <option 
                    key={device.id} 
                    value={device.id}
                    disabled={device.status === 'offline'}
                  >
                    {device.name} 
                    {device.status === 'online' && deviceIPs[device.id] ? 
                      ` (${deviceIPs[device.id]})` : 
                      ` (${device.status})`
                    }
                  </option>
                ))}
              </select>
              <button
                onClick={() => setSelectedDeviceDetails(deviceOptions.find(d => d.id === selectedDevice))}
                className="absolute right-8 top-1/2 -translate-y-1/2"
              >
                <InformationCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-md"
              value={executionMode}
              onChange={(e) => setExecutionMode(e.target.value)}
            >
              <option value="parallel">Parallel Execution</option>
              <option value="sequential">Sequential Execution</option>
            </select>
            <button
              onClick={() => setViewMode(prev => prev === 'expanded' ? 'compact' : 'expanded')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              {viewMode === 'expanded' ? 'Compact View' : 'Expanded View'}
            </button>
          </div>
          <button
            onClick={handleRunAllSuites}
            disabled={isRunningAll}
            className={`flex items-center px-4 py-2 text-sm font-medium text-white rounded ${
              isRunningAll ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Run All Suites
          </button>
        </div>

        {/* Device Details Panel */}
        {selectedDeviceDetails && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <ComputerDesktopIcon className="h-6 w-6 text-gray-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">{selectedDeviceDetails.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDeviceDetails(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="mt-1 flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                    selectedDeviceDetails.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {selectedDeviceDetails.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Connection</p>
                <p className="mt-1">{getConnectionStrength(selectedDeviceDetails.connectionStrength)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">OS Version</p>
                <p className="mt-1">{selectedDeviceDetails.osVersion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IP Address</p>
                <div className="mt-1 flex items-center">
                  {selectedDeviceDetails.status === 'online' ? (
                    <>
                      <span className="text-sm">{deviceIPs[selectedDeviceDetails.id] || 'Connecting...'}</span>
                      {deviceIPs[selectedDeviceDetails.id] && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                          Live
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">Offline</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Successful Run</p>
                <p className="mt-1">{new Date(selectedDeviceDetails.lastSuccessfulRun).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Health Status</p>
                <p className="mt-1 capitalize">{selectedDeviceDetails.healthStatus}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Filters */}
      <div className="mb-6 flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search test suites..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md min-w-[150px]"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="lastRun">Sort by Last Run</option>
          <option value="alphabetical">Sort Alphabetically</option>
          <option value="status">Sort by Status</option>
          <option value="passRate">Sort by Pass Rate</option>
        </select>
      </div>

      {/* Test Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuites.map((suite) => (
          <div
            key={suite.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BeakerIcon className="h-6 w-6 text-gray-400 mr-2" />
                  <h2 
                    className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => router.push(`/test/${suite.id}`)}
                  >
                    {suite.name}
                  </h2>
                </div>
                <button
                  onClick={() => toggleSuiteExpansion(suite.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {expandedSuites.includes(suite.id) ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              
              {/* Description and Stats */}
              <p className="text-sm text-gray-600 mb-4">{suite.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <div className="text-gray-500">
                  {suite.passedTests}/{suite.totalTests} tests passed
                </div>
                <div className="text-gray-400">
                  Last run: {new Date(suite.lastRun).toLocaleDateString()}
                </div>
              </div>

              {/* Add Device Selection before Suite Action Buttons */}
              <div className="mb-4">
                <select
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md"
                  value={suiteDevices[suite.id]}
                  onChange={(e) => handleDeviceChange(suite.id, e.target.value)}
                  disabled={suite.status === TEST_STATES.RUNNING}
                >
                  {deviceOptions.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Individual Test Cases */}
              {expandedSuites.includes(suite.id) && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  {testCaseMapping[suite.id]?.map((test) => (
                    <div key={test.id}>
                      <div
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleTestDetails(test.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {getTestStatusIcon(test.status, runningTestsProgress[suite.id]?.[test.id])}
                          <span className="text-sm font-medium text-gray-900">
                            {test.id}
                          </span>
                          <span className="text-sm text-gray-500">
                            {test.name}
                          </span>
                          {test.duration && (
                            <span className="text-xs text-gray-400">
                              {(test.duration / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {test.status === TEST_STATES.RUNNING ? (
                            <button
                              onClick={() => handleStopTest(suite.id, test.id)}
                              className="flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700"
                            >
                              <StopIcon className="h-3 w-3 mr-1" />
                              Stop
                            </button>
                          ) : (
                            <button
                              onClick={() => runTest(suite.id, test.id, suiteDevices[suite.id])}
                              className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                              disabled={deviceOptions.find(d => d.id === suiteDevices[suite.id])?.status === 'offline'}
                            >
                              <PlayIcon className="h-3 w-3 mr-1" />
                              Run
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Test Details */}
                      {expandedTestDetails.includes(test.id) && (
                        <div className="mt-2 ml-8 p-3 bg-gray-50 rounded-md">
                          <div className="space-y-3">
                            {/* Test Timeline */}
                            <div className="flex items-center text-sm">
                              <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                              <div className="flex-1">
                                <div className="h-1.5 bg-gray-200 rounded-full">
                                  <div 
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${runningTestsProgress[suite.id]?.[test.id] || 0}%` }}
                                  />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                  <span>Start</span>
                                  <span>Setup</span>
                                  <span>Execute</span>
                                  <span>Verify</span>
                                  <span>End</span>
                                </div>
                              </div>
                            </div>

                            {/* Test Logs */}
                            {test.logs && (
                              <div className="text-sm">
                                <div className="flex items-center text-gray-700 mb-1">
                                  <ClipboardDocumentListIcon className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Logs</span>
                                </div>
                                <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                                  {test.logs.join('\n')}
                                </pre>
                              </div>
                            )}

                            {/* Test Screenshots */}
                            {test.screenshots && (
                              <div className="text-sm">
                                <div className="flex items-center text-gray-700 mb-1">
                                  <PhotoIcon className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Screenshots</span>
                                </div>
                                <div className="flex space-x-2 overflow-x-auto">
                                  {test.screenshots.map((screenshot, index) => (
                                    <img
                                      key={index}
                                      src={screenshot}
                                      alt={`Test screenshot ${index + 1}`}
                                      className="h-24 rounded border border-gray-200"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Error Details */}
                            {test.error && (
                              <div className="text-sm">
                                <div className="flex items-center text-red-600 mb-1">
                                  <ExclamationCircleIcon className="h-4 w-4 mr-2" />
                                  <span className="font-medium">Error</span>
                                </div>
                                <pre className="bg-red-50 text-red-900 p-2 rounded text-xs overflow-x-auto">
                                  {test.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Suite Action Buttons */}
              <div className="flex space-x-2 mt-4">
                {suite.status !== TEST_STATES.RUNNING ? (
                  <>
                    <button
                      onClick={() => handleRunSuite(suite.id, suiteDevices[suite.id])}
                      className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                      disabled={isRunningAll}
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Run Suite
                    </button>
                    {suite.failedTests > 0 && (
                      <button
                        onClick={() => handleRunFailedTests(suite.id)}
                        className="flex items-center px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-1" />
                        Run Failed
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => handleStopRun(suite.id)}
                    className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    <StopIcon className="h-4 w-4 mr-1" />
                    Stop Run
                  </button>
                )}
                <button
                  onClick={() => router.push(`/test/${suite.id}`)}
                  className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 