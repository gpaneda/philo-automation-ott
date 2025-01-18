'use client';

import { useState } from 'react';
import { CalendarIcon, FunnelIcon } from '@heroicons/react/24/outline';

const timeRanges = [
  { label: '24h', value: '24h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
];

export function FilterBar() {
  const [selectedRange, setSelectedRange] = useState('24h');

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Time range buttons */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  selectedRange === range.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Custom date range */}
          <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Custom Range
          </button>
        </div>

        <div className="flex items-center space-x-4">
          {/* Project/Build Filter */}
          <button className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border rounded-md">
            <FunnelIcon className="h-4 w-4 mr-1" />
            Filter
          </button>

          {/* Refresh button */}
          <button className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
} 