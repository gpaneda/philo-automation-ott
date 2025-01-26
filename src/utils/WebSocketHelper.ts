import WebSocket from 'ws';

interface WebSocketMessage {
    type: string;
    data: any;
}

class WebSocketHelper {
    private url: string;
    private socket: WebSocket | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;

    constructor(url: string) {
        this.url = url;
    }

    async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url);

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

    private reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => {
                console.log(`Reconnecting attempt ${this.reconnectAttempts}...`);
                this.connect().catch(() => this.reconnect());
            }, 1000);
        } else {
            console.error('Max reconnect attempts reached. Please check the WebSocket server.');
        }
    }

    send(message: WebSocketMessage): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
            this.onMessage((response) => {
                if (response.type === 'ack' && response.data === message.data) {
                    console.log('Message acknowledged:', message);
                }
            });
        } else {
            console.error('WebSocket is not open. Cannot send message:', message);
        }
    }

    onMessage(callback: (data: WebSocketMessage) => void, timeout: number = 5000): void {
        if (this.socket) {
            const messageHandler = (data: string) => {
                const parsedData: WebSocketMessage = JSON.parse(data);
                callback(parsedData);
                clearTimeout(timer);
                this.socket?.removeListener('message', messageHandler);
            };

            this.socket.on('message', messageHandler);

            const timer = setTimeout(() => {
                console.error('Timeout waiting for WebSocket message');
                this.socket?.removeListener('message', messageHandler);
            }, timeout);
        }
    }

    close(): void {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export default WebSocketHelper;
