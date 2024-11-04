import { WebSocket } from 'ws';
import { WebSocketMessage } from './types';
import { logger } from '../utils/logger';
import {
  handleDeviceConnect,
  handleDeviceStatus,
  handleDeviceDisconnect
} from './handlers/deviceHandler';
import { handlePlaybackStatus } from './handlers/playbackHandler';

// Store active WebSocket connections
const deviceConnections = new Map<string, WebSocket>();

export const handleWebSocket = (ws: WebSocket) => {
  let deviceId: string | null = null;

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message) as WebSocketMessage;
      deviceId = data.deviceId;

      // Store the connection
      if (deviceId && !deviceConnections.has(deviceId)) {
        deviceConnections.set(deviceId, ws);
      }

      switch (data.type) {
        case 'connect':
          await handleDeviceConnect(ws, data);
          break;

        case 'status':
          await handleDeviceStatus(data);
          break;

        case 'playback':
          await handlePlaybackStatus(data);
          break;

        case 'ping':
          ws.pong();
          break;

        default:
          logger.warn('Unknown message type:', data.type);
      }
    } catch (error) {
      logger.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    if (deviceId) {
      deviceConnections.delete(deviceId);
      handleDeviceDisconnect(deviceId);
    }
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
    ws.terminate();
  });

  ws.on('pong', () => {
    if (deviceId) {
      const connection = deviceConnections.get(deviceId);
      if (connection) {
        // Update last ping time in Redis
        handleDeviceStatus({
          type: 'status',
          deviceId,
          data: {
            online: true,
            lastSeen: new Date().toISOString(),
            ip: '',
            version: '',
            systemInfo: {
              os: '',
              cpu: 0,
              memory: { total: 0, used: 0 },
              storage: { total: 0, used: 0 }
            }
          }
        });
      }
    }
  });
};

// Export the connections map for use in other modules
export const getDeviceConnection = (deviceId: string): WebSocket | undefined => {
  return deviceConnections.get(deviceId);
};

// Export function to broadcast to all connected devices
export const broadcastToDevices = (message: any): void => {
  deviceConnections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
};

// Export function to send message to specific device
export const sendToDevice = (deviceId: string, message: any): boolean => {
  const ws = deviceConnections.get(deviceId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    return true;
  }
  return false;
};

// Cleanup disconnected sockets periodically
setInterval(() => {
  deviceConnections.forEach((ws, deviceId) => {
    if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
      deviceConnections.delete(deviceId);
      handleDeviceDisconnect(deviceId);
    }
  });
}, 30000); // Check every 30 seconds