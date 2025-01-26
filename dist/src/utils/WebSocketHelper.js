"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class WebSocketHelper {
    constructor(url) {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.url = url;
    }
    async connect() {
        return new Promise((resolve, reject) => {
            this.socket = new ws_1.default(this.url);
            this.socket.on('open', () => {
                console.log('WebSocket connection established');
                this.reconnectAttempts = 0;
                resolve();
            });
            this.socket.on('error', (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            });
            this.socket.on('close', () => {
                console.log('WebSocket connection closed. Attempting to reconnect...');
                this.reconnect();
            });
        });
    }
    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Reconnecting attempt ${this.reconnectAttempts}...`);
                this.connect().catch(() => this.reconnect());
            }, 1000);
        }
        else {
            console.error('Max reconnect attempts reached. Please check the WebSocket server.');
        }
    }
    send(message) {
        if (this.socket && this.socket.readyState === ws_1.default.OPEN) {
            this.socket.send(JSON.stringify(message));
            this.onMessage((response) => {
                if (response.type === 'ack' && response.data === message.data) {
                    console.log('Message acknowledged:', message);
                }
            });
        }
        else {
            console.error('WebSocket is not open. Cannot send message:', message);
        }
    }
    onMessage(callback, timeout = 5000) {
        if (this.socket) {
            const messageHandler = (data) => {
                var _a;
                const parsedData = JSON.parse(data);
                callback(parsedData);
                clearTimeout(timer);
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.removeListener('message', messageHandler);
            };
            this.socket.on('message', messageHandler);
            const timer = setTimeout(() => {
                var _a;
                console.error('Timeout waiting for WebSocket message');
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.removeListener('message', messageHandler);
            }, timeout);
        }
    }
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}
exports.default = WebSocketHelper;
