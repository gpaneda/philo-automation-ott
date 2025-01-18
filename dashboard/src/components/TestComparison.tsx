import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { TestSession } from '@/types/testSession';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TestComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  currentRun: TestSession;
  historicalRun: TestSession;
}

export function TestComparison({ isOpen, onClose, currentRun, historicalRun }: TestComparisonProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const statusColors = {
    passed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    running: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-gray-100 text-gray-800',
  };

  const getDiffIndicator = (current: number, historical: number) => {
    if (current === historical) return null;
    const isImprovement = current > historical;
    return (
      <span className={`ml-2 text-sm ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
        {isImprovement ? '↑' : '↓'} {Math.abs(current - historical)}
      </span>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Test Run Comparison
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  {/* Current Run */}
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500">Current Run</h4>
                      <p className="text-sm text-gray-900">{formatDate(currentRun.startTime)}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-sm rounded-full ${statusColors[currentRun.status]}`}>
                            {currentRun.status.charAt(0).toUpperCase() + currentRun.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Duration: {formatDuration(currentRun.duration)}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Total Tests</div>
                            <div className="mt-1 text-xl font-semibold">{currentRun.totalTests}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Pass Rate</div>
                            <div className="mt-1 text-xl font-semibold">
                              {Math.round((currentRun.passedTests / currentRun.totalTests) * 100)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Passed Tests</div>
                            <div className="mt-1 text-xl font-semibold text-green-600">
                              {currentRun.passedTests}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Failed Tests</div>
                            <div className="mt-1 text-xl font-semibold text-red-600">
                              {currentRun.failedTests}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Historical Run */}
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500">Historical Run</h4>
                      <p className="text-sm text-gray-900">{formatDate(historicalRun.startTime)}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-sm rounded-full ${statusColors[historicalRun.status]}`}>
                            {historicalRun.status.charAt(0).toUpperCase() + historicalRun.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Duration: {formatDuration(historicalRun.duration)}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Total Tests</div>
                            <div className="mt-1 text-xl font-semibold">
                              {historicalRun.totalTests}
                              {getDiffIndicator(currentRun.totalTests, historicalRun.totalTests)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Pass Rate</div>
                            <div className="mt-1 text-xl font-semibold">
                              {Math.round((historicalRun.passedTests / historicalRun.totalTests) * 100)}%
                              {getDiffIndicator(
                                Math.round((currentRun.passedTests / currentRun.totalTests) * 100),
                                Math.round((historicalRun.passedTests / historicalRun.totalTests) * 100)
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Passed Tests</div>
                            <div className="mt-1 text-xl font-semibold text-green-600">
                              {historicalRun.passedTests}
                              {getDiffIndicator(currentRun.passedTests, historicalRun.passedTests)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Failed Tests</div>
                            <div className="mt-1 text-xl font-semibold text-red-600">
                              {historicalRun.failedTests}
                              {getDiffIndicator(currentRun.failedTests, historicalRun.failedTests)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Test Comparison */}
                <div className="mt-8">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Test Details Comparison</h4>
                  <div className="border rounded-lg divide-y">
                    <div className="grid grid-cols-5 bg-gray-50 p-4 text-sm font-medium text-gray-500">
                      <div>Test ID</div>
                      <div className="col-span-2">Current Run</div>
                      <div className="col-span-2">Historical Run</div>
                    </div>
                    {/* We'll map through test cases here when we have the data */}
                    <div className="p-4 grid grid-cols-5 text-sm">
                      <div className="font-medium">TC101</div>
                      <div className="col-span-2">
                        <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                          Passed
                        </span>
                        <span className="ml-2 text-gray-500">2.3s</span>
                      </div>
                      <div className="col-span-2">
                        <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">
                          Failed
                        </span>
                        <span className="ml-2 text-gray-500">3.1s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 