"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 3000 });
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.on('message', (message) => {
        console.log('Received:', message);
        // Echo the message back to the client
        ws.send(JSON.stringify({ type: 'ack', data: message }));
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server is running on ws://localhost:3000');
