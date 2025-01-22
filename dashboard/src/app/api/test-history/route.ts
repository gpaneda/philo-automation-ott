import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface TestCase {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  duration: string | number;
  error?: string;
}

interface TestResult {
  suiteId: string;
  suite: string;
  name: string;
  status: 'passed' | 'failed';
  timestamp: string;
  lastRun: string;
  duration: number;
  error?: string;
  testCases: TestCase[];
}

// Map of test suite IDs to display names
const suiteDisplayNames: Record<string, string> = {
  'test:landing': 'Landing Page Tests',
  'test:navigation': 'Navigation Tests',
  'test:login': 'Login Tests',
  'test:series': 'Series Details Tests',
  'test:playback': 'Playback Tests',
  'test:movies': 'Movies Details Tests'
};

// Function to get display name for a test suite
function getSuiteDisplayName(suiteId: string): string {
  return suiteDisplayNames[suiteId] || suiteId.replace('test:', '').split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') + ' Tests';
}

// Function to convert test case data from Test Suites format to History format
function convertTestCase(testCase: any): TestCase {
  return {
    id: testCase.id,
    name: testCase.name,
    status: testCase.status === 'idle' ? 'pending' : testCase.status,
    duration: testCase.duration ? `${Math.floor(testCase.duration / 60)}m ${testCase.duration % 60}s` : '--',
    error: testCase.error
  };
}

// Function to convert test suite data to test execution history format
function convertToTestExecution(suite: TestResult, index: number) {
  const passedTests = (suite.testCases || []).filter(test => test.status === 'passed').length;
  const totalTests = (suite.testCases || []).length;

  return {
    id: index + 1,
    suiteId: suite.suiteId,
    suiteName: getSuiteDisplayName(suite.suiteId),
    status: suite.status,
    startTime: suite.timestamp,
    endTime: suite.lastRun,
    duration: suite.duration ? `${Math.floor(suite.duration / 60000)}m ${Math.floor((suite.duration % 60000) / 1000)}s` : '--',
    totalTests,
    passedTests,
    environment: 'Production', // This should come from configuration
    triggeredBy: 'Automated', // This should come from the actual trigger
    error: suite.error,
    testCases: (suite.testCases || []).map(convertTestCase)
  };
}

// Path to the test results file
const TEST_RESULTS_FILE = path.join(process.cwd(), 'test-results.json');

// Function to read test results from file
async function readTestResults(): Promise<TestResult[]> {
  try {
    const data = await fs.readFile(TEST_RESULTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Function to write test results to file
async function writeTestResults(results: TestResult[]): Promise<void> {
  await fs.writeFile(TEST_RESULTS_FILE, JSON.stringify(results, null, 2));
}

// Function to update test results
export async function updateTestResults(result: any) {
  const testCases = result.testCases || [{
    id: result.testId || 'unknown',
    name: result.testName || `Test ${result.testId || 'unknown'}`,
    status: result.status,
    duration: result.duration,
    error: result.error
  }];

  const newResult: TestResult = {
    suiteId: result.suite,
    suite: result.suite,
    name: getSuiteDisplayName(result.suite),
    status: result.status,
    timestamp: result.timestamp,
    lastRun: new Date().toISOString(),
    duration: result.duration,
    error: result.error,
    testCases
  };

  // Read current results
  const testResults = await readTestResults();

  // Find existing result for the same suite
  const existingIndex = testResults.findIndex(r => r.suiteId === result.suite);
  
  if (existingIndex !== -1) {
    // Update existing result
    testResults[existingIndex] = {
      ...testResults[existingIndex],
      ...newResult
    };
  } else {
    // Add new result
    testResults.push(newResult);
  }

  // Write updated results back to file
  await writeTestResults(testResults);
}

export async function GET() {
  try {
    // Read test results from file
    const testResults = await readTestResults();
    
    // Convert test results to history format
    const testHistory = testResults.map(convertToTestExecution);
    return NextResponse.json(testHistory);
  } catch (error) {
    console.error('Error fetching test history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test history' },
      { status: 500 }
    );
  }
} 