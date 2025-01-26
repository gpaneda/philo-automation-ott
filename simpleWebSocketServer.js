"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({ port: 3000 });
wss.on('connection', function (ws) {
    console.log('New client connected');
    ws.on('message', function (message) {
        console.log('Received:', message.toString());
        // Broadcast the message to all connected clients
        wss.clients.forEach(function (client) {
            if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
    ws.on('close', function () {
        console.log('Client disconnected');
    });
});
console.log('WebSocket server is running on ws://localhost:3000');
