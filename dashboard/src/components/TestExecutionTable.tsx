'use client';

import { TestSession } from '@/types/testSession';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface TestExecutionTableProps {
  sessions: TestSession[];
  onSessionClick: (id: string) => void;
}

type SortField = 'status' | 'name' | 'results' | 'duration' | 'startTime';
type SortDirection = 'asc' | 'desc';

export function TestExecutionTable({ sessions, onSessionClick }: TestExecutionTableProps) {
  const [sortField, setSortField] = useState<SortField>('startTime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const statusColors = {
    passed: 'bg-green-400',
    failed: 'bg-red-400',
    running: 'bg-yellow-400',
    pending: 'bg-gray-400',
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'status':
        return multiplier * a.status.localeCompare(b.status);
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'results':
        const aPassRate = a.passedTests / a.totalTests;
        const bPassRate = b.passedTests / b.totalTests;
        return multiplier * (aPassRate - bPassRate);
      case 'duration':
        return multiplier * (a.duration - b.duration);
      case 'startTime':
        return multiplier * (new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      default:
        return 0;
    }
  });

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="inline-flex flex-col">
          <ChevronUpIcon className={`h-3 w-3 ${sortField === field && sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} />
          <ChevronDownIcon className={`h-3 w-3 -mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400'}`} />
        </span>
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead>
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Test Suite
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Start Time
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Duration
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Tests
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {sessions.map((session) => (
            <tr 
              key={session.id}
              onClick={() => onSessionClick(session.id)}
              className="hover:bg-gray-800 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                {session.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${session.status === 'passed' ? 'bg-blue-900 text-blue-200' : 
                    session.status === 'failed' ? 'bg-pink-900 text-pink-200' : 
                    'bg-purple-900 text-purple-200'}`}>
                  {session.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {formatDuration(session.duration)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {session.passedTests}/{session.totalTests}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 