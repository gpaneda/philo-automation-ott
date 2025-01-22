import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const result = await request.json();
        console.log('Received test result:', result);

        // Here you can update your state or database with the test result
        // For example, you might want to store it in a database or update a global state

        return NextResponse.json({ message: 'Test result received successfully' });
    } catch (error) {
        console.error('Error processing test result:', error);
        return NextResponse.json({ error: 'Failed to process test result' }, { status: 500 });
    }
} 