export interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'idle' | 'running' | 'passed' | 'failed' | 'stopped';
  lastRun?: string | Date;
  duration?: number;
  error?: string;
  logContent?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
}

export interface Device {
  id: string;
  name: string;
  status: 'active' | 'busy' | 'offline';
  ipAddress: string;
}

export interface TestExecutionConfig {
  suiteId: string;
  testId?: string;
  deviceId: string;
  deviceIp?: string;
  email?: string;
  mode?: 'suite' | 'single' | 'failed';
}

export interface TestExecutionResponse {
  success: boolean;
  output: string;
  errors?: string;
}

export interface TestResult {
  testId: string;
  status: string;
  duration: number;
  error?: string;
  logs: string[];
  screenshots: string[];
  deviceInfo: {
    id: string;
    name: string;
    version: string;
  };
} 