'use client';

import { useState } from 'react';
import {
  BellIcon,
  DevicePhoneMobileIcon,
  CogIcon,
  CloudIcon,
  KeyIcon,
  ClockIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  CircleStackIcon,
  ServerIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

export default function Settings() {
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(true);
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [notifyOnSuccess, setNotifyOnSuccess] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(true);

  // Test Configuration
  const [autoRetry, setAutoRetry] = useState(true);
  const [maxRetries, setMaxRetries] = useState(3);
  const [parallelTests, setParallelTests] = useState(true);
  const [maxParallelTests, setMaxParallelTests] = useState(5);
  const [screenshotOnFailure, setScreenshotOnFailure] = useState(true);
  const [videoRecording, setVideoRecording] = useState(true);

  // Device Management
  const [deviceTimeout, setDeviceTimeout] = useState(30);
  const [autoReboot, setAutoReboot] = useState(true);
  const [healthCheckInterval, setHealthCheckInterval] = useState(15);

  // Integration Settings
  const [jenkinsUrl, setJenkinsUrl] = useState('https://jenkins.example.com');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/...');
  const [jiraUrl, setJiraUrl] = useState('https://jira.example.com');

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Configure your test automation environment and preferences
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Device Configuration */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">Device Configuration</h3>
              <p className="mt-1 text-sm text-gray-400">Manage your test devices and their settings.</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Default Device</label>
                  <select className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Fire TV Stick 4K</option>
                    <option>Fire TV Cube</option>
                    <option>Fire TV Stick Lite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Device Location</label>
                  <select className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>US-East</option>
                    <option>US-West</option>
                    <option>EU-Central</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Configuration */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">Test Configuration</h3>
              <p className="mt-1 text-sm text-gray-400">Configure test execution parameters.</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Default Test Environment</label>
                  <select className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Production</option>
                    <option>Staging</option>
                    <option>Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Parallel Test Execution</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-300">Enable parallel test execution</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Max Parallel Tests</label>
                  <input type="number" min="1" max="10" className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500" defaultValue="3" />
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-800">
              <h3 className="text-lg font-medium text-white">Notification Settings</h3>
              <p className="mt-1 text-sm text-gray-400">Configure how you want to receive test notifications.</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email Notifications</label>
                  <div className="mt-2 space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-300">Test failures</span>
                    </label>
                    <div className="block">
                      <label className="inline-flex items-center">
                        <input type="checkbox" className="rounded bg-gray-800 border-gray-700 text-blue-500 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-gray-300">Test completion</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">Email Recipients</label>
                  <input type="text" className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Enter email addresses (comma-separated)" />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 