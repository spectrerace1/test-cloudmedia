export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 5000;
  private pingInterval: number | null = null;
  private deviceId: string;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private connectionHandlers: Set<() => void> = new Set();
  private errorHandlers: Set<(error: any) => void> = new Set();

  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  connect() {
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}/ws`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.startPing();
      this.sendMessage('connect', { deviceId: this.deviceId });
      this.connectionHandlers.forEach(handler => handler());
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.stopPing();
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.errorHandlers.forEach(handler => handler(error));
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
          handler(message.data);
        } else {
          console.warn('No handler for message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
  }

  onConnect(handler: () => void) {
    this.connectionHandlers.add(handler);
  }

  onError(handler: (error: any) => void) {
    this.errorHandlers.add(handler);
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  sendMessage(type: string, data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type,
        deviceId: this.deviceId,
        data
      }));
    }
  }

  private startPing() {
    this.pingInterval = window.setInterval(() => {
      this.sendMessage('ping', {});
    }, 30000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connect(), this.reconnectTimeout);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopPing();
    this.messageHandlers.clear();
    this.connectionHandlers.clear();
    this.errorHandlers.clear();
  }
}

export const createWebSocketService = (deviceId: string) => {
  return new WebSocketService(deviceId);
};