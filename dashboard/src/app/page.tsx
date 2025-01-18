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
    <div className="min-h-screen bg-gray-50">
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
              <div className="bg-white rounded-lg shadow">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 