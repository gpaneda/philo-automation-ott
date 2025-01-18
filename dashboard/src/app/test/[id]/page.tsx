'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { TestSession } from '@/types/testSession';
import { useState, useEffect } from 'react';
import { TestComparison } from '@/components/TestComparison';

// Mock data with actual test suite names
const mockSessions: TestSession[] = [
  {
    id: '1',
    name: 'Landing Page Tests',
    status: 'passed',
    startTime: new Date(Date.now() - 3600000).toISOString(),
    duration: 3600000,
    totalTests: 3,
    passedTests: 3,
    failedTests: 0,
  },
  {
    id: '2',
    name: 'Movies Details Tests',
    status: 'failed',
    startTime: new Date(Date.now() - 7200000).toISOString(),
    duration: 7200000,
    totalTests: 2,
    passedTests: 1,
    failedTests: 1,
  },
  {
    id: '3',
    name: 'Navigation Tests',
    status: 'running',
    startTime: new Date(Date.now() - 1800000).toISOString(),
    duration: 1800000,
    totalTests: 12,
    passedTests: 8,
    failedTests: 0,
  },
  {
    id: '4',
    name: 'Playback Tests',
    status: 'passed',
    startTime: new Date(Date.now() - 5400000).toISOString(),
    duration: 2400000,
    totalTests: 5,
    passedTests: 5,
    failedTests: 0,
  },
  {
    id: '5',
    name: 'Series Details Tests',
    status: 'running',
    startTime: new Date(Date.now() - 900000).toISOString(),
    duration: 900000,
    totalTests: 5,
    passedTests: 3,
    failedTests: 0,
  },
  {
    id: '6',
    name: 'Login Tests',
    status: 'passed',
    startTime: new Date(Date.now() - 4500000).toISOString(),
    duration: 1200000,
    totalTests: 1,
    passedTests: 1,
    failedTests: 0,
  }
];

export default function TestDetails() {
  const router = useRouter();
  const params = useParams();
  const [session, setSession] = useState<TestSession | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [selectedHistoricalRun, setSelectedHistoricalRun] = useState<TestSession | null>(null);

  // Mock historical sessions for the current test suite
  const generateHistoricalSession = (index: number): TestSession & {
    environment: string;
    browser: string;
    device: string;
    failureCategories?: {
      setup: number;
      assertion: number;
      timeout: number;
      network: number;
    };
    previousRunDiff?: {
      duration: number;
      passRate: number;
    };
  } => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    const passRate = Math.round(Math.random() * 20 + 80);
    const totalTests = session?.totalTests || 0;
    const passedTests = Math.floor((passRate / 100) * totalTests);
    const failedTests = totalTests - passedTests;
    
    // Generate mock failure categories if there are failures
    const failureCategories = failedTests > 0 ? {
      setup: Math.floor(Math.random() * failedTests),
      assertion: Math.floor(Math.random() * failedTests),
      timeout: Math.floor(Math.random() * failedTests),
      network: Math.floor(Math.random() * failedTests),
    } : undefined;

    // Mock previous run differences
    const previousRunDiff = {
      duration: Math.random() * 2000 - 1000, // Random time difference between -1000ms and +1000ms
      passRate: Math.random() * 10 - 5, // Random pass rate difference between -5% and +5%
    };
    
    return {
      id: `${session?.id}-history-${index}`,
      name: session?.name || '',
      status: passRate === 100 ? 'passed' : 'failed',
      startTime: date.toISOString(),
      duration: Math.random() * 3600000,
      totalTests,
      passedTests,
      failedTests,
      environment: ['Production', 'Staging', 'Development'][Math.floor(Math.random() * 3)],
      browser: ['Fire TV Stick', 'Fire TV Cube', 'Fire TV Smart TV'][Math.floor(Math.random() * 3)],
      device: ['4K Max', 'Lite', '3rd Gen'][Math.floor(Math.random() * 3)],
      failureCategories,
      previousRunDiff,
    };
  };

  useEffect(() => {
    // In real implementation, this would fetch data from an API
    const testSession = mockSessions.find(s => s.id === params.id);
    setSession(testSession || null);
  }, [params.id]);

  const handleCompareClick = (historicalRun: TestSession) => {
    setSelectedHistoricalRun(historicalRun);
    setIsComparisonOpen(true);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div>Test session not found</div>
        </div>
      </div>
    );
  }

  const statusColors = {
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    running: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-gray-100 text-gray-800',
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button and breadcrumbs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Dashboard
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{session.name}</span>
          </div>
          
          {/* Test Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const currentIndex = mockSessions.findIndex(s => s.id === session.id);
                if (currentIndex > 0) {
                  router.push(`/test/${mockSessions[currentIndex - 1].id}`);
                }
              }}
              disabled={mockSessions.findIndex(s => s.id === session.id) === 0}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous Suite
            </button>
            <div className="relative">
              <select
                value={session.id}
                onChange={(e) => router.push(`/test/${e.target.value}`)}
                className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                {mockSessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                const currentIndex = mockSessions.findIndex(s => s.id === session.id);
                if (currentIndex < mockSessions.length - 1) {
                  router.push(`/test/${mockSessions[currentIndex + 1].id}`);
                }
              }}
              disabled={mockSessions.findIndex(s => s.id === session.id) === mockSessions.length - 1}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Suite →
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{session.name}</h1>
                <div className="mt-1 flex items-center">
                  <span className={`px-2 py-1 text-sm rounded-full ${statusColors[session.status]}`}>
                    {session.status}
                  </span>
                  <span className="ml-4 text-sm text-gray-500">
                    Started {new Date(session.startTime).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Duration</div>
                <div className="text-lg font-semibold">{formatDuration(session.duration)}</div>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Total Tests</div>
                <div className="mt-1 text-2xl font-semibold">{session.totalTests}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Passed Tests</div>
                <div className="mt-1 text-2xl font-semibold text-green-600">{session.passedTests}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Failed Tests</div>
                <div className="mt-1 text-2xl font-semibold text-red-600">{session.failedTests}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Pass Rate</div>
                <div className="mt-1 text-2xl font-semibold">
                  {Math.round((session.passedTests / session.totalTests) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results Section */}
        <div className="bg-white shadow rounded-lg mt-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Test Results</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {/* Test results with actual TC numbers */}
              {(() => {
                // Define TC numbers and names for each test suite
                const tcMapping = {
                  '1': [ // Landing Page Tests
                    { id: 'TC101', name: 'Verify Landing Page Loads Successfully' },
                    { id: 'TC102', name: 'Verify Featured Content Carousel' },
                    { id: 'TC103', name: 'Verify Navigation Menu Items' }
                  ],
                  '2': [ // Movies Details Tests
                    { id: 'TC124', name: 'Verify Movie Details Page Layout' },
                    { id: 'TC125', name: 'Verify Movie Playback Controls' }
                  ],
                  '3': [ // Navigation Tests
                    { id: 'TC106', name: 'Verify Main Menu Navigation' },
                    { id: 'TC107', name: 'Verify Search Functionality' },
                    { id: 'TC108', name: 'Verify Category Filtering' },
                    { id: 'TC109', name: 'Verify Genre Selection' },
                    { id: 'TC110', name: 'Verify Profile Switching' },
                    { id: 'TC111', name: 'Verify Settings Menu' },
                    { id: 'TC112', name: 'Verify Back Button Navigation' },
                    { id: 'TC113', name: 'Verify Home Button Navigation' },
                    { id: 'TC114', name: 'Verify Menu Shortcuts' },
                    { id: 'TC115', name: 'Verify Content Browsing' },
                    { id: 'TC116', name: 'Verify Quick Menu Access' },
                    { id: 'TC117', name: 'Verify Navigation History' }
                  ],
                  '4': [ // Playback Tests
                    { id: 'TC201', name: 'Verify Video Quality Selection' },
                    { id: 'TC202', name: 'Verify Playback Controls' },
                    { id: 'TC203', name: 'Verify Closed Captions' },
                    { id: 'TC204', name: 'Verify Audio Track Selection' },
                    { id: 'TC205', name: 'Verify Playback Resume' }
                  ],
                  '5': [ // Series Details Tests
                    { id: 'TC119', name: 'Verify Series Overview Page' },
                    { id: 'TC120', name: 'Verify Episode List Navigation' },
                    { id: 'TC121', name: 'Verify Season Selection' },
                    { id: 'TC122', name: 'Verify Episode Details' },
                    { id: 'TC123', name: 'Verify Series Information' }
                  ],
                  '6': [ // Login Tests
                    { id: 'TC103', name: 'Verify User Authentication Flow' }
                  ]
                };

                const testCases = tcMapping[session.id] || [];
                return testCases.map((test, index) => {
                  const isPassed = index < session.passedTests;
                  return (
                    <div
                      key={test.id}
                      className={`p-4 rounded-lg ${
                        isPassed ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{test.id}</span>
                            <span className="ml-2 text-gray-600">-</span>
                            <span className="ml-2 text-gray-900">{test.name}</span>
                            <span className={`ml-4 px-2 py-1 text-sm rounded-full ${
                              isPassed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isPassed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            {isPassed
                              ? 'Test completed successfully'
                              : 'Test failed - See error details below'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Duration: {Math.round(Math.random() * 10 + 1)}s
                        </div>
                      </div>
                      {!isPassed && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-red-800">Error Details:</div>
                          <pre className="mt-2 text-sm text-red-600 bg-red-50 p-4 rounded overflow-x-auto">
                            Error: Expected element to be visible but it was not found in the DOM
                            at line 42 in test_suite.spec.ts
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Test History Section */}
        <div className="bg-white shadow rounded-lg mt-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Execution History</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => {
                const historicalRun = generateHistoricalSession(index + 1);
                const diffIndicator = (value: number, isTime = false) => {
                  if (value === 0) return null;
                  const isPositive = value > 0;
                  return (
                    <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '↑' : '↓'} {isTime ? formatDuration(Math.abs(value)) : `${Math.abs(value).toFixed(1)}%`}
                    </span>
                  );
                };

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="p-4">
                      <div className="flex flex-col space-y-4">
                        {/* Top section with status and basic info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="flex items-center">
                                <span className={`px-2 py-1 text-sm rounded-full ${statusColors[historicalRun.status]}`}>
                                  {historicalRun.status.charAt(0).toUpperCase() + historicalRun.status.slice(1)}
                                </span>
                                <span className="ml-2 text-sm text-gray-500">
                                  {new Date(historicalRun.startTime).toLocaleDateString()} {new Date(historicalRun.startTime).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="mt-1">
                                <span className="text-sm font-medium text-gray-900">
                                  Pass Rate: {Math.round((historicalRun.passedTests / historicalRun.totalTests) * 100)}%
                                  {historicalRun.previousRunDiff && (
                                    <span className="ml-2">
                                      {diffIndicator(historicalRun.previousRunDiff.passRate)}
                                    </span>
                                  )}
                                </span>
                                <span className="mx-2 text-gray-300">|</span>
                                <span className="text-sm text-gray-500">
                                  Duration: {formatDuration(historicalRun.duration)}
                                  {historicalRun.previousRunDiff && (
                                    <span className="ml-2">
                                      {diffIndicator(historicalRun.previousRunDiff.duration, true)}
                                    </span>
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-900">
                                {historicalRun.totalTests} Tests
                              </div>
                              <div className="text-sm text-gray-500">
                                {historicalRun.passedTests} Passed
                              </div>
                            </div>
                            <button
                              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompareClick(historicalRun);
                              }}
                            >
                              Compare
                            </button>
                          </div>
                        </div>

                        {/* Environment details */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div>
                            <span className="font-medium">Environment:</span> {historicalRun.environment}
                          </div>
                          <div>
                            <span className="font-medium">Device:</span> {historicalRun.browser} ({historicalRun.device})
                          </div>
                        </div>

                        {/* Failure categories if any */}
                        {historicalRun.failureCategories && (
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(historicalRun.failureCategories).map(([category, count]) => {
                              if (count === 0) return null;
                              return (
                                <span
                                  key={category}
                                  className="px-2 py-1 text-xs rounded-full bg-red-50 text-red-700"
                                >
                                  {category.charAt(0).toUpperCase() + category.slice(1)}: {count}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparison Modal */}
        {session && selectedHistoricalRun && (
          <TestComparison
            isOpen={isComparisonOpen}
            onClose={() => setIsComparisonOpen(false)}
            currentRun={session}
            historicalRun={selectedHistoricalRun}
          />
        )}
      </div>
    </div>
  );
} 