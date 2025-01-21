interface TestCase {
  id: string;
  name: string;
  status: string;
  duration: string;
  error?: string;
}

interface TestSuite {
  id: number;
  suiteId: string;
  suiteName: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: string;
  totalTests: number;
  passedTests: number;
  environment: string;
  triggeredBy: string;
  error?: string;
  testCases: TestCase[];
}

export const historyData: TestSuite[] = [
  {
    id: 1,
    suiteId: 'suite-1',
    suiteName: 'Landing Page Tests',
    status: 'passed',
    startTime: '2025-01-17T15:48:13',
    endTime: '2025-01-17T15:49:44',
    duration: '1m 31s',
    totalTests: 3,
    passedTests: 3,
    environment: 'Production',
    triggeredBy: 'Automated Schedule',
    testCases: [
      { id: 'TC101', name: 'Verify Landing Page Loads Successfully', status: 'passed', duration: '45s' },
      { id: 'TC102', name: 'Check Navigation Menu Functionality', status: 'passed', duration: '46s' }
    ]
  },
  {
    id: 2,
    suiteId: 'suite-2',
    suiteName: 'Movies Details Tests',
    status: 'failed',
    startTime: '2025-01-17T16:00:00',
    endTime: '2025-01-17T16:02:30',
    duration: '2m 30s',
    totalTests: 2,
    passedTests: 1,
    environment: 'Production',
    triggeredBy: 'Manual',
    error: 'Network timeout during playback',
    testCases: [
      { id: 'TC201', name: 'Verify Movie Details Page', status: 'passed', duration: '1m 15s' },
      { id: 'TC202', name: 'Test Movie Playback', status: 'failed', duration: '1m 15s', error: 'Network timeout during playback initialization' }
    ]
  },
  {
    id: 3,
    suiteId: 'suite-3',
    suiteName: 'Navigation Tests',
    status: 'passed',
    startTime: '2025-01-17T16:15:00',
    endTime: '2025-01-17T16:20:00',
    duration: '5m',
    totalTests: 12,
    passedTests: 12,
    environment: 'Production',
    triggeredBy: 'CI/CD Pipeline',
    testCases: [
      { id: 'TC301', name: 'Main Menu Navigation', status: 'passed', duration: '30s' },
      { id: 'TC302', name: 'Category Switching', status: 'passed', duration: '45s' }
    ]
  }
]; 