"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocketHelper_1 = __importDefault(require("../utils/WebSocketHelper"));
// Replace with your local WebSocket server URL
const wsUrl = 'ws://localhost:3000'; // Adjust the port as needed
const wsHelper = new WebSocketHelper_1.default(wsUrl);
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
    }
    catch (error) {
        console.error('Error during WebSocket test:', error);
    }
}
// Run the test
runTest();
