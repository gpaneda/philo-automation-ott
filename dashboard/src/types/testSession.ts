export type TestStatus = 'passed' | 'failed' | 'running' | 'pending';

export interface TestSession {
  id: string;
  name: string;
  status: TestStatus;
  startTime: string;
  duration: number; // in milliseconds
  totalTests: number;
  passedTests: number;
  failedTests: number;
}

export interface TestSessionsResponse {
  sessions: TestSession[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
} 