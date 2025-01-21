'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilterBar } from '@/components/FilterBar';
import { StatsStrip } from '@/components/StatsStrip';
import { TestExecutionTable } from '@/components/TestExecutionTable';
import { TestStatusPieChart } from '@/components/TestStatusPieChart';
import { TestSession } from '@/types/testSession';

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
    totalTests: 2,
    passedTests: 2,
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

export default function Home() {
  const [sessions] = useState<TestSession[]>(mockSessions);
  const router = useRouter();

  const handleSessionClick = (id: string) => {
    router.push(`/test/${id}`);
  };

  // Calculate stats
  const totalTests = sessions.reduce((acc, s) => acc + s.totalTests, 0);
  const totalPassed = sessions.reduce((acc, s) => acc + s.passedTests, 0);
  const passRate = Math.round((totalPassed / totalTests) * 100);
  const avgDuration = sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length;
  const activeTests = sessions.filter(s => s.status === 'running').length;

  // Calculate totals for pie charts
  const totalPassedTests = sessions.reduce((acc, session) => acc + session.passedTests, 0);
  const totalFailedTests = sessions.reduce((acc, session) => acc + session.failedTests, 0);
  const totalRunningTests = sessions.reduce(
    (acc, session) => acc + (session.status === 'running' ? session.totalTests - session.passedTests - session.failedTests : 0),
    0
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Landing Section */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                GP QA Testing, LLC
              </h1>
              <p className="mt-2 text-xl text-gray-400">
                Advanced Test Automation Framework
              </p>
            </div>
            {/* Logo */}
            <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">GP</span>
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-3">Core Technologies</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Node.js & TypeScript</li>
                <li>• Appium for Device Control</li>
                <li>• WebdriverIO Test Runner</li>
                <li>• Jest Testing Framework</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Dashboard Stack</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Next.js 13 App Router</li>
                <li>• React with TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Chart.js for Analytics</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
              <h3 className="text-lg font-semibold text-pink-400 mb-3">Testing Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Parallel Test Execution</li>
                <li>• Real-time Test Monitoring</li>
                <li>• Detailed Test Reports</li>
                <li>• CI/CD Integration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FilterBar />
      <StatsStrip
        totalTests={totalTests}
        passRate={passRate}
        avgDuration={avgDuration}
        activeTests={activeTests}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Main content area */}
          <div className="grid grid-cols-12 gap-6">
            {/* Test execution table */}
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-gray-900 rounded-lg shadow">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-800">
                  <h3 className="text-lg font-medium leading-6 text-white">
                    Test Executions
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <TestExecutionTable
                    sessions={sessions}
                    onSessionClick={handleSessionClick}
                  />
                </div>
              </div>
            </div>

            {/* Charts sidebar */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <TestStatusPieChart
                passed={totalPassedTests}
                failed={totalFailedTests}
                running={totalRunningTests}
                title="Test Status Distribution"
                darkMode={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 