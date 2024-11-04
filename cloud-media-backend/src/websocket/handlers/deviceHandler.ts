import { WebSocket } from 'ws';
import { DeviceConnection, WebSocketMessage, DeviceStatus } from '../types';
import { redisClient } from '../../utils/redis';
import { logger } from '../../utils/logger';
import { DeviceService } from '../../services/device.service';

const deviceService = new DeviceService();
const connections = new Map<string, DeviceConnection>();

export const handleDeviceConnect = async (ws: WebSocket, message: WebSocketMessage) => {
  const { deviceId } = message;
  const device = await deviceService.findById(deviceId);

  if (!device) {
    ws.close(4001, 'Device not found');
    return;
  }

  // Store connection
  connections.set(deviceId, {
    ws,
    deviceId,
    branchId: device.branch.id,
    lastPing: Date.now()
  });

  // Update device status
  await redisClient.hSet(`device:${deviceId}`, {
    status: 'online',
    lastSeen: new Date().toISOString()
  });

  logger.info(`Device connected: ${deviceId}`);

  // Send initial configuration
  sendDeviceConfig(deviceId);
};

export const handleDeviceStatus = async (message: WebSocketMessage) => {
  const { deviceId, data } = message;
  const status = data as DeviceStatus;

  await redisClient.hSet(`device:${deviceId}`, {
    ...status,
    lastSeen: new Date().toISOString()
  });

  logger.debug(`Device status updated: ${deviceId}`, status);
};

export const handleDeviceDisconnect = async (deviceId: string) => {
  const connection = connections.get(deviceId);
  if (connection) {
    connections.delete(deviceId);
    
    await redisClient.hSet(`device:${deviceId}`, {
      status: 'offline',
      lastSeen: new Date().toISOString()
    });

    logger.info(`Device disconnected: ${deviceId}`);
  }
};

export const sendDeviceConfig = async (deviceId: string) => {
  const connection = connections.get(deviceId);
  if (!connection) return;

  const device = await deviceService.findById(deviceId);
  const config = {
    volume: device.branch.settings?.volume || 100,
    operatingHours: device.branch.settings?.operatingHours,
    timezone: device.branch.settings?.timezone
  };

  connection.ws.send(JSON.stringify({
    type: 'config',
    data: config
  }));
};

export const sendCommand = async (deviceId: string, command: string, data?: any) => {
  const connection = connections.get(deviceId);
  if (!connection) {
    logger.warn(`Cannot send command to offline device: ${deviceId}`);
    return false;
  }

  connection.ws.send(JSON.stringify({
    type: 'command',
    command,
    data
  }));

  return true;
};

// Ping handling
setInterval(() => {
  const now = Date.now();
  connections.forEach((connection, deviceId) => {
    if (now - connection.lastPing > 30000) { // 30 seconds timeout
      connection.ws.terminate();
      handleDeviceDisconnect(deviceId);
    } else {
      connection.ws.ping();
    }
  });
}, 15000); // Check every 15 seconds