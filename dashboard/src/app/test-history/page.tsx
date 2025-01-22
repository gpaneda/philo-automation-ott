'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CalendarIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import FormattedDate from '../../components/FormattedDate';

// Remove mock history data and replace with proper interfaces
interface TestCase {
  id: string;
  name: string;
  status: string;
  duration: string;
  error?: string;
}

interface TestExecution {
  id: number;
  suiteId: string;
  suiteName: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: string;
  totalTests: number;
  passedTests: number;
  environment: string;
  triggeredBy: string;
  error?: string;
  testCases: TestCase[];
}

export default function TestHistory() {
  const [expandedExecutions, setExpandedExecutions] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [sortConfig, setSortConfig] = useState<{
    key: 'startTime' | 'suiteName' | 'status' | 'totalTests' | 'passedTests' | 'duration';
    direction: 'asc' | 'desc';
  }>({ key: 'startTime', direction: 'desc' });
  const [testHistory, setTestHistory] = useState<TestExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Function to fetch test history
  const fetchTestHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-history');
      if (!response.ok) {
        throw new Error('Failed to fetch test history');
      }
      const data = await response.json();
      setTestHistory(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching test history');
      console.error('Error fetching test history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestHistory();
    // Set up polling to refresh data periodically
    const interval = setInterval(fetchTestHistory, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const sortedAndFilteredHistory = testHistory
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading test history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p>{error}</p>
          <button 
            onClick={fetchTestHistory}
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
          {sortedAndFilteredHistory.length === 0 ? (
            <div className="text-center py-12 bg-gray-900 rounded-lg">
              <p className="text-gray-400">No test executions found</p>
            </div>
          ) : (
            sortedAndFilteredHistory.map((execution) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
} 