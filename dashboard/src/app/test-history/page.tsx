'use client';

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CalendarIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import FormattedDate from '../../components/FormattedDate';

// Mock history data with 20 test suites
const historyData = [
  {
    id: 1,
    suiteId: 'suite-1',
    suiteName: 'Landing Page Tests',
    status: 'passed',
    startTime: '2025-01-17T15:48:13',
    endTime: '2025-01-17T15:49:44',
    duration: '1m 31s',
    totalTests: 3,
    passedTests: 3,
    environment: 'Production',
    triggeredBy: 'Automated Schedule',
    testCases: [
      { id: 'TC101', name: 'Verify Landing Page Loads Successfully', status: 'passed', duration: '45s' },
      { id: 'TC102', name: 'Check Navigation Menu Functionality', status: 'passed', duration: '46s' }
    ]
  },
  {
    id: 2,
    suiteId: 'suite-2',
    suiteName: 'Movies Details Tests',
    status: 'failed',
    startTime: '2025-01-17T16:00:00',
    endTime: '2025-01-17T16:02:30',
    duration: '2m 30s',
    totalTests: 2,
    passedTests: 1,
    environment: 'Production',
    triggeredBy: 'Manual',
    error: 'Network timeout during playback',
    testCases: [
      { id: 'TC201', name: 'Verify Movie Details Page', status: 'passed', duration: '1m 15s' },
      { id: 'TC202', name: 'Test Movie Playback', status: 'failed', duration: '1m 15s', error: 'Network timeout during playback initialization' }
    ]
  },
  {
    id: 3,
    suiteId: 'suite-3',
    suiteName: 'Navigation Tests',
    status: 'passed',
    startTime: '2025-01-17T16:15:00',
    endTime: '2025-01-17T16:20:00',
    duration: '5m',
    totalTests: 12,
    passedTests: 12,
    environment: 'Production',
    triggeredBy: 'CI/CD Pipeline',
    testCases: [
      { id: 'TC301', name: 'Main Menu Navigation', status: 'passed', duration: '30s' },
      { id: 'TC302', name: 'Category Switching', status: 'passed', duration: '45s' }
    ]
  },
  {
    id: 4,
    suiteId: 'suite-4',
    suiteName: 'Search Functionality',
    status: 'failed',
    startTime: '2025-01-17T16:30:00',
    endTime: '2025-01-17T16:35:00',
    duration: '5m',
    totalTests: 5,
    passedTests: 3,
    environment: 'Staging',
    triggeredBy: 'Manual',
    error: 'Search results not matching expected output',
    testCases: [
      { id: 'TC401', name: 'Basic Search', status: 'passed', duration: '1m' },
      { id: 'TC402', name: 'Advanced Filters', status: 'failed', duration: '2m', error: 'Filter combination not working' }
    ]
  },
  {
    id: 5,
    suiteId: 'suite-5',
    suiteName: 'User Profile Tests',
    status: 'passed',
    startTime: '2025-01-17T17:00:00',
    endTime: '2025-01-17T17:10:00',
    duration: '10m',
    totalTests: 8,
    passedTests: 8,
    environment: 'Production',
    triggeredBy: 'Automated Schedule',
    testCases: [
      { id: 'TC501', name: 'Profile Update', status: 'passed', duration: '2m' },
      { id: 'TC502', name: 'Preferences Save', status: 'passed', duration: '1m' }
    ]
  },
  {
    id: 6,
    suiteId: 'suite-6',
    suiteName: 'Payment Integration',
    status: 'failed',
    startTime: '2025-01-17T17:30:00',
    endTime: '2025-01-17T17:40:00',
    duration: '10m',
    totalTests: 6,
    passedTests: 4,
    environment: 'Staging',
    triggeredBy: 'Manual',
    error: 'Payment gateway timeout',
    testCases: [
      { id: 'TC601', name: 'Credit Card Payment', status: 'failed', duration: '3m', error: 'Gateway timeout' },
      { id: 'TC602', name: 'PayPal Integration', status: 'passed', duration: '2m' }
    ]
  },
  {
    id: 7,
    suiteId: 'suite-7',
    suiteName: 'Content Streaming',
    status: 'passed',
    startTime: '2025-01-17T18:00:00',
    endTime: '2025-01-17T18:15:00',
    duration: '15m',
    totalTests: 10,
    passedTests: 10,
    environment: 'Production',
    triggeredBy: 'CI/CD Pipeline',
    testCases: [
      { id: 'TC701', name: 'HD Streaming', status: 'passed', duration: '5m' },
      { id: 'TC702', name: 'Quality Switching', status: 'passed', duration: '4m' }
    ]
  },
  {
    id: 8,
    suiteId: 'suite-8',
    suiteName: 'Offline Mode',
    status: 'failed',
    startTime: '2025-01-17T18:30:00',
    endTime: '2025-01-17T18:40:00',
    duration: '10m',
    totalTests: 4,
    passedTests: 2,
    environment: 'Development',
    triggeredBy: 'Manual',
    error: 'Content sync failed',
    testCases: [
      { id: 'TC801', name: 'Download Content', status: 'failed', duration: '3m', error: 'Sync error' },
      { id: 'TC802', name: 'Offline Playback', status: 'passed', duration: '2m' }
    ]
  },
  {
    id: 9,
    suiteId: 'suite-9',
    suiteName: 'Performance Tests',
    status: 'passed',
    startTime: '2025-01-17T19:00:00',
    endTime: '2025-01-17T19:30:00',
    duration: '30m',
    totalTests: 15,
    passedTests: 15,
    environment: 'Production',
    triggeredBy: 'Automated Schedule',
    testCases: [
      { id: 'TC901', name: 'Load Time Analysis', status: 'passed', duration: '10m' },
      { id: 'TC902', name: 'Memory Usage', status: 'passed', duration: '8m' }
    ]
  },
  {
    id: 10,
    suiteId: 'suite-10',
    suiteName: 'Security Tests',
    status: 'failed',
    startTime: '2025-01-17T20:00:00',
    endTime: '2025-01-17T20:30:00',
    duration: '30m',
    totalTests: 12,
    passedTests: 10,
    environment: 'Staging',
    triggeredBy: 'Manual',
    error: 'Vulnerability detected in API endpoint',
    testCases: [
      { id: 'TC1001', name: 'Authentication', status: 'passed', duration: '5m' },
      { id: 'TC1002', name: 'API Security', status: 'failed', duration: '8m', error: 'Vulnerability in endpoint' }
    ]
  },
  {
    id: 11,
    suiteId: 'suite-11',
    suiteName: 'Accessibility Tests',
    status: 'passed',
    startTime: '2025-01-17T21:00:00',
    endTime: '2025-01-17T21:15:00',
    duration: '15m',
    totalTests: 8,
    passedTests: 8,
    environment: 'Production',
    triggeredBy: 'CI/CD Pipeline',
    testCases: [
      { id: 'TC1101', name: 'Screen Reader Compatibility', status: 'passed', duration: '4m' },
      { id: 'TC1102', name: 'Keyboard Navigation', status: 'passed', duration: '3m' }
    ]
  },
  {
    id: 12,
    suiteId: 'suite-12',
    suiteName: 'Cross-Device Tests',
    status: 'failed',
    startTime: '2025-01-17T22:00:00',
    endTime: '2025-01-17T22:30:00',
    duration: '30m',
    totalTests: 20,
    passedTests: 15,
    environment: 'Staging',
    triggeredBy: 'Manual',
    error: 'Mobile layout issues detected',
    testCases: [
      { id: 'TC1201', name: 'Desktop Layout', status: 'passed', duration: '6m' },
      { id: 'TC1202', name: 'Mobile Layout', status: 'failed', duration: '7m', error: 'Layout breaks on small screens' }
    ]
  },
  {
    id: 13,
    suiteId: 'suite-13',
    suiteName: 'Content Management',
    status: 'passed',
    startTime: '2025-01-17T23:00:00',
    endTime: '2025-01-17T23:20:00',
    duration: '20m',
    totalTests: 10,
    passedTests: 10,
    environment: 'Production',
    triggeredBy: 'Automated Schedule',
    testCases: [
      { id: 'TC1301', name: 'Content Upload', status: 'passed', duration: '5m' },
      { id: 'TC1302', name: 'Metadata Management', status: 'passed', duration: '4m' }
    ]
  },
  {
    id: 14,
    suiteId: 'suite-14',
    suiteName: 'Analytics Integration',
    status: 'failed',
    startTime: '2025-01-18T00:00:00',
    endTime: '2025-01-18T00:15:00',
    duration: '15m',
    totalTests: 6,
    passedTests: 4,
    environment: 'Development',
    triggeredBy: 'Manual',
    error: 'Data tracking inconsistency',
    testCases: [
      { id: 'TC1401', name: 'Event Tracking', status: 'failed', duration: '4m', error: 'Missing events' },
      { id: 'TC1402', name: 'Data Validation', status: 'passed', duration: '3m' }
    ]
  },
  {
    id: 15,
    suiteId: 'suite-15',
    suiteName: 'Localization Tests',
    status: 'passed',
    startTime: '2025-01-18T01:00:00',
    endTime: '2025-01-18T01:30:00',
    duration: '30m',
    totalTests: 25,
    passedTests: 25,
    environment: 'Production',
    triggeredBy: 'CI/CD Pipeline',
    testCases: [
      { id: 'TC1501', name: 'Language Switch', status: 'passed', duration: '8m' },
      { id: 'TC1502', name: 'Content Translation', status: 'passed', duration: '7m' }
    ]
  },
  {
    id: 16,
    suiteId: 'suite-16',
    suiteName: 'Error Handling',
    status: 'failed',
    startTime: '2025-01-18T02:00:00',
    endTime: '2025-01-18T02:15:00',
    duration: '15m',
    totalTests: 8,
    passedTests: 6,
    environment: 'Staging',
    triggeredBy: 'Manual',
    error: 'Unexpected error recovery behavior',
    testCases: [
      { id: 'TC1601', name: 'Network Error', status: 'failed', duration: '4m', error: 'Recovery failed' },
      { id: 'TC1602', name: 'Input Validation', status: 'passed', duration: '3m' }
    ]
  },
  {
    id: 17,
    suiteId: 'suite-17',
    suiteName: 'Backup Systems',
    status: 'passed',
    startTime: '2025-01-18T03:00:00',
    endTime: '2025-01-18T03:20:00',
    duration: '20m',
    totalTests: 5,
    passedTests: 5,
    environment: 'Production',
    triggeredBy: 'Automated Schedule',
    testCases: [
      { id: 'TC1701', name: 'Data Backup', status: 'passed', duration: '6m' },
      { id: 'TC1702', name: 'System Recovery', status: 'passed', duration: '5m' }
    ]
  },
  {
    id: 18,
    suiteId: 'suite-18',
    suiteName: 'API Integration',
    status: 'failed',
    startTime: '2025-01-18T04:00:00',
    endTime: '2025-01-18T04:30:00',
    duration: '30m',
    totalTests: 15,
    passedTests: 12,
    environment: 'Development',
    triggeredBy: 'Manual',
    error: 'Third-party API failure',
    testCases: [
      { id: 'TC1801', name: 'External APIs', status: 'failed', duration: '8m', error: 'API timeout' },
      { id: 'TC1802', name: 'Internal APIs', status: 'passed', duration: '7m' }
    ]
  },
  {
    id: 19,
    suiteId: 'suite-19',
    suiteName: 'User Authentication',
    status: 'passed',
    startTime: '2025-01-18T05:00:00',
    endTime: '2025-01-18T05:15:00',
    duration: '15m',
    totalTests: 10,
    passedTests: 10,
    environment: 'Production',
    triggeredBy: 'CI/CD Pipeline',
    testCases: [
      { id: 'TC1901', name: 'Login Flow', status: 'passed', duration: '4m' },
      { id: 'TC1902', name: 'Password Reset', status: 'passed', duration: '3m' }
    ]
  },
  {
    id: 20,
    suiteId: 'suite-20',
    suiteName: 'Device Management',
    status: 'failed',
    startTime: '2025-01-18T06:00:00',
    endTime: '2025-01-18T06:20:00',
    duration: '20m',
    totalTests: 8,
    passedTests: 6,
    environment: 'Staging',
    triggeredBy: 'Manual',
    error: 'Device synchronization issue',
    testCases: [
      { id: 'TC2001', name: 'Device Pairing', status: 'failed', duration: '5m', error: 'Sync failed' },
      { id: 'TC2002', name: 'Remote Control', status: 'passed', duration: '4m' }
    ]
  }
];

export default function TestHistory() {
  const [expandedExecutions, setExpandedExecutions] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [sortConfig, setSortConfig] = useState<{
    key: 'startTime' | 'suiteName' | 'status' | 'totalTests' | 'passedTests' | 'duration';
    direction: 'asc' | 'desc';
  }>({ key: 'startTime', direction: 'desc' });

  const toggleExecution = (executionId: number) => {
    setExpandedExecutions(prev =>
      prev.includes(executionId) ? prev.filter(id => id !== executionId) : [...prev, executionId]
    );
  };

  const handleSort = (key: typeof sortConfig.key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedAndFilteredHistory = [...historyData]
    .filter(execution => {
      if (statusFilter === 'all') return true;
      return execution.status === statusFilter;
    })
    .sort((a, b) => {
      switch (sortConfig.key) {
        case 'startTime': {
          const direction = sortConfig.direction === 'asc' ? 1 : -1;
          return (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) * direction;
        }
        case 'suiteName': {
          const direction = sortConfig.direction === 'asc' ? 1 : -1;
          return a.suiteName.localeCompare(b.suiteName) * direction;
        }
        case 'status': {
          const direction = sortConfig.direction === 'asc' ? 1 : -1;
          return a.status.localeCompare(b.status) * direction;
        }
        case 'totalTests':
          return (a.totalTests - b.totalTests) * (sortConfig.direction === 'asc' ? 1 : -1);
        case 'passedTests':
          return (a.passedTests - b.passedTests) * (sortConfig.direction === 'asc' ? 1 : -1);
        case 'duration': {
          // Convert duration string to minutes for comparison
          const getDurationInMinutes = (duration: string) => {
            const matches = duration.match(/(\d+)m/);
            return matches ? parseInt(matches[1]) : 0;
          };
          const direction = sortConfig.direction === 'asc' ? 1 : -1;
          return (getDurationInMinutes(a.duration) - getDurationInMinutes(b.duration)) * direction;
        }
        default:
          return 0;
      }
    });

  const SortIcon = ({ field }: { field: typeof sortConfig.key }) => {
    if (sortConfig.key !== field) return null;
    return sortConfig.direction === 'asc' ? 
      <ArrowUpIcon className="h-4 w-4 text-gray-400" /> : 
      <ArrowDownIcon className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            <span className="text-blue-500">Test</span> <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="mt-2 text-gray-400">
            View and analyze your test execution history
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-gray-200 bg-gray-900 rounded-md border border-gray-800">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Date Range
            </button>
            <button className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-gray-200 bg-gray-900 rounded-md border border-gray-800">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Test History List */}
        <div className="space-y-4">
          {sortedAndFilteredHistory.map((execution) => (
            <div key={execution.id} className="bg-gray-900 rounded-lg shadow">
              {/* Execution Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-800 rounded-t-lg"
                onClick={() => toggleExecution(execution.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {expandedExecutions.includes(execution.id) ? (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    )}
                    <span className="font-medium text-white">{execution.suiteName}</span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      execution.status === 'passed' ? 'bg-blue-900 text-blue-200' : 'bg-pink-900 text-pink-200'
                    }`}>
                      {execution.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{execution.duration}</span>
                    <FormattedDate date={execution.startTime} />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedExecutions.includes(execution.id) && (
                <div className="p-4 border-t border-gray-800">
                  {/* Execution Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Execution Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Environment:</span> {execution.environment}</p>
                        <p><span className="text-gray-500">Triggered By:</span> {execution.triggeredBy}</p>
                        <p><span className="text-gray-500">Duration:</span> {execution.duration}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Test Results</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-gray-500">Total Tests:</span> {execution.totalTests}</p>
                        <p><span className="text-gray-500">Passed Tests:</span> <span className="text-blue-400">{execution.passedTests}</span></p>
                        <p><span className="text-gray-500">Pass Rate:</span> <span className="text-blue-400">{Math.round((execution.passedTests / execution.totalTests) * 100)}%</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Test Cases */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Test Cases</h4>
                    <div className="space-y-2">
                      {execution.testCases.map((testCase) => (
                        <div key={testCase.id} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                          <div>
                            <span className="text-sm font-medium text-gray-300">{testCase.id}</span>
                            <span className="ml-2 text-sm text-gray-400">{testCase.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">{testCase.duration}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              testCase.status === 'passed' ? 'bg-blue-900 text-blue-200' : 'bg-pink-900 text-pink-200'
                            }`}>
                              {testCase.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 