'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
  HomeIcon,
  BeakerIcon,
  ClockIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  PlayCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Test Suites', href: '/test-suites', icon: BeakerIcon },
  { name: 'Test History', href: '/test-history', icon: ClockIcon },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Test Dry Run', href: '/test-dry-run', icon: PlayIcon },
];

const quickFilters = [
  { name: 'Running Tests', href: '/running', icon: PlayCircleIcon, count: 2, color: 'text-yellow-500' },
  { name: 'Failed Tests', href: '/failed', icon: ExclamationTriangleIcon, count: 3, color: 'text-red-500' },
  { name: 'Recent Runs', href: '/recent', icon: ArrowPathIcon, count: 5, color: 'text-blue-500' },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <span className="text-xl font-semibold text-gray-800">Test Dashboard</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md group ${
                active
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 ${
                  active ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Quick Filters */}
      <div className="px-4 py-4 border-t border-gray-200">
        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Quick Filters
        </h3>
        <div className="mt-3 space-y-1">
          {quickFilters.map((filter) => (
            <Link
              key={filter.name}
              href={filter.href}
              className="flex items-center justify-between px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <div className="flex items-center">
                <filter.icon
                  className={`mr-3 h-5 w-5 ${filter.color}`}
                  aria-hidden="true"
                />
                {filter.name}
              </div>
              {filter.count > 0 && (
                <span className={`px-2 py-1 text-xs rounded-full bg-gray-100 ${filter.color}`}>
                  {filter.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* User Section */}
      <div className="flex items-center px-4 py-3 border-t border-gray-200">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-gray-300" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700">Test Admin</p>
          <p className="text-xs text-gray-500">View Profile</p>
        </div>
      </div>
    </div>
  );
} 