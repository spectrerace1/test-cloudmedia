import { WebSocket } from 'ws';
import { WebSocketMessage } from './types';
import { logger } from '../utils/logger';
import {
  handleDeviceConnect,
  handleDeviceStatus,
  handleDeviceDisconnect
} from './handlers/deviceHandler';
import { handlePlaybackStatus } from './handlers/playbackHandler';

export const handleWebSocket = (ws: WebSocket) => {
  let deviceId: string | null = null;

  ws.on('message', async (message: string) => {
    try {
      const data = JSON.parse(message) as WebSocketMessage;
      deviceId = data.deviceId;

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
      handleDeviceDisconnect(deviceId);
    }
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
    ws.terminate();
  });

  ws.on('pong', () => {
    if (deviceId) {
      const connection = connections.get(deviceId);
      if (connection) {
        connection.lastPing = Date.now();
      }
    }
  });
};