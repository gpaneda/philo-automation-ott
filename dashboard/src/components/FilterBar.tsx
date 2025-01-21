'use client';

import { useState } from 'react';
import { CalendarIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const timeRanges = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
];

export function FilterBar() {
  const [selectedRange, setSelectedRange] = useState('24h');
  const [showCustomRange, setShowCustomRange] = useState(false);

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Time Range Buttons */}
          <div className="flex items-center space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  selectedRange === range.value
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
            <button
              onClick={() => setShowCustomRange(!showCustomRange)}
              className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200"
            >
              Custom Range
            </button>
          </div>

          {/* Project/Build Filter */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-gray-200">
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 text-sm text-blue-400 hover:text-blue-300">
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 