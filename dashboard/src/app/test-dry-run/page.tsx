'use client';

import TestRunner from '@/components/TestRunner';

export default function TestDryRunPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Dry Run</h1>
        <p className="mt-1 text-sm text-gray-500">
          Safely test the command generation without executing actual tests
        </p>
      </div>

      <TestRunner />
    </div>
  );
} 