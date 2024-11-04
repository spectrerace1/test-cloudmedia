import { WebSocketMessage } from '../types';
import { redisClient } from '../../utils/redis';
import { logger } from '../../utils/logger';
import { sendCommand } from './deviceHandler';

export const handlePlaybackStatus = async (message: WebSocketMessage) => {
  const { deviceId, data: playbackStatus } = message;

  await redisClient.hSet(`device:${deviceId}:playback`, {
    ...playbackStatus,
    updatedAt: new Date().toISOString()
  });

  logger.debug(`Playback status updated: ${deviceId}`, playbackStatus);
};

export const controlPlayback = async (deviceId: string, action: string, data?: any) => {
  const success = await sendCommand(deviceId, `playback:${action}`, data);
  
  if (success) {
    logger.info(`Playback command sent: ${deviceId} - ${action}`);
    return true;
  }
  
  return false;
};

export const updateVolume = async (deviceId: string, volume: number) => {
  const success = await sendCommand(deviceId, 'volume:set', { volume });
  
  if (success) {
    await redisClient.hSet(`device:${deviceId}:playback`, {
      volume,
      updatedAt: new Date().toISOString()
    });
    return true;
  }
  
  return false;
};

export const changePlaylist = async (deviceId: string, playlistId: string) => {
  const success = await sendCommand(deviceId, 'playlist:change', { playlistId });
  
  if (success) {
    await redisClient.hSet(`device:${deviceId}:playback`, {
      playlist: playlistId,
      updatedAt: new Date().toISOString()
    });
    return true;
  }
  
  return false;
};