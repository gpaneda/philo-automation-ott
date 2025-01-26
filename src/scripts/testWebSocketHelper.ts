import WebSocketHelper from '../utils/WebSocketHelper';

// Replace with your local WebSocket server URL
const wsUrl = 'ws://localhost:3000'; // Adjust the port as needed
const wsHelper = new WebSocketHelper(wsUrl);

async function runTest() {
    try {
        // Connect to the WebSocket server
        await wsHelper.connect();

        // Set up a message handler
        wsHelper.onMessage((data) => {
            console.log('Received message:', data);
        });

        // Send a test message
        const testMessage = { type: 'test', data: 'Hello, WebSocket!' };
        wsHelper.send(testMessage);
        console.log('Sent message:', testMessage);

        // Wait for a few seconds to receive messages
        setTimeout(() => {
            wsHelper.close();
            console.log('WebSocket connection closed.');
        }, 5000); // Adjust the timeout as needed

    } catch (error) {
        console.error('Error during WebSocket test:', error);
    }
}

// Run the test
runTest();
