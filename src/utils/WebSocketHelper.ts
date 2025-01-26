import WebSocket from 'ws';
import { EventEmitter } from 'events';

interface WebSocketMessage {
    type: string;
    data: any;
}

interface WebSocketHelperOptions {
    url: string;
    maxReconnectAttempts?: number;
    reconnectDelay?: number;
}

class WebSocketHelper extends EventEmitter {
    private url: string;
    private socket: WebSocket | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number;
    private reconnectDelay: number;
    private messageQueue: WebSocketMessage[] = [];

    constructor(options: WebSocketHelperOptions) {
        super();
        this.url = options.url;
        this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
        this.reconnectDelay = options.reconnectDelay || 1000;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url);

            this.socket.on('open', () => {
                console.log('WebSocket connection established');
                this.reconnectAttempts = 0;
                this.sendQueuedMessages(); // Send any queued messages
                resolve();
            });

            this.socket.on('error', (error) => {
                console.error('WebSocket error occurred:', error.message);
                reject(error);
            });

            this.socket.on('close', () => {
                console.log('WebSocket connection closed. Attempting to reconnect...');
                this.reconnect();
            });
        });
    }

    private reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Reconnecting attempt ${this.reconnectAttempts}...`);
                this.connect().catch(() => this.reconnect());
                this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max delay of 30 seconds
            }, this.reconnectDelay);
        } else {
            console.error('Max reconnect attempts reached. Please check the WebSocket server.');
        }
    }

    send(message: WebSocketMessage): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not open. Queuing message:', message);
            this.messageQueue.push(message);
        }
    }

    private async sendQueuedMessages() {
        while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message) {
                this.socket?.send(JSON.stringify(message));
            }
        }
    }

    onMessage(callback: (data: WebSocketMessage) => void): void {
        this.on('message', callback);
    }

    private handleMessage(data: string) {
        const parsedData: WebSocketMessage = JSON.parse(data);
        this.emit('message', parsedData);
    }

    close(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default WebSocketHelper;
