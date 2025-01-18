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
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
    <div className="bg-white shadow-sm rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <SortHeader field="status" label="Status" />
              <SortHeader field="name" label="Test Name" />
              <SortHeader field="results" label="Results" />
              <SortHeader field="duration" label="Duration" />
              <SortHeader field="startTime" label="Started" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSessions.map((session) => (
              <tr
                key={session.id}
                onClick={() => onSessionClick(session.id)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${statusColors[session.status]} mr-2`} />
                    <span className="text-sm text-gray-900 capitalize">{session.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{session.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {session.passedTests}/{session.totalTests} passed
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(session.duration)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 