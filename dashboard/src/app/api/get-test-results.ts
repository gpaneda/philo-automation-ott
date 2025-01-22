import { NextResponse } from 'next/server';

// Mock data for demonstration purposes
let testResults = [];

export async function POST(request: Request) {
    return NextResponse.json(testResults);
}

// This function can be called to update the test results when a test completes
export function updateTestResults(result) {
    testResults.push(result);
} 