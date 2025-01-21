'use client';

interface StatsStripProps {
  totalTests: number;
  passRate: number;
  avgDuration: number;
  activeTests: number;
}

export function StatsStrip({ totalTests, passRate, avgDuration, activeTests }: StatsStripProps) {
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes} min`;
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Tests */}
          <div className="px-4 sm:px-6 py-4">
            <p className="text-sm font-medium text-gray-400">Total Tests</p>
            <p className="mt-1 text-2xl font-semibold text-white">{totalTests}</p>
          </div>

          {/* Pass Rate */}
          <div className="px-4 sm:px-6 py-4">
            <p className="text-sm font-medium text-gray-400">Pass Rate</p>
            <p className="mt-1 text-2xl font-semibold text-blue-400">{passRate}%</p>
          </div>

          {/* Average Duration */}
          <div className="px-4 sm:px-6 py-4">
            <p className="text-sm font-medium text-gray-400">Avg. Duration</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {Math.round(avgDuration / 60000)}m
            </p>
          </div>

          {/* Active Tests */}
          <div className="px-4 sm:px-6 py-4">
            <p className="text-sm font-medium text-gray-400">Active Tests</p>
            <p className="mt-1 text-2xl font-semibold text-purple-400">{activeTests}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 