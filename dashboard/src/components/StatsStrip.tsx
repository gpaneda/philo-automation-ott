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
    <div className="bg-white border-b">
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start space-x-8">
          <div>
            <div className="text-xs font-medium text-gray-500">Total Tests</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{totalTests}</div>
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div>
            <div className="text-xs font-medium text-gray-500">Pass Rate</div>
            <div className="mt-1 text-lg font-semibold text-green-600">{passRate}%</div>
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div>
            <div className="text-xs font-medium text-gray-500">Avg. Duration</div>
            <div className="mt-1 text-lg font-semibold text-gray-900">{formatDuration(avgDuration)}</div>
          </div>

          <div className="h-8 w-px bg-gray-200" />

          <div>
            <div className="text-xs font-medium text-gray-500">Active Tests</div>
            <div className="mt-1 text-lg font-semibold text-blue-600">{activeTests}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 