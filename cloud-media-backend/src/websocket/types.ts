import { WebSocket } from 'ws';

export interface DeviceConnection {
  ws: WebSocket;
  deviceId: string;
  branchId: string;
  lastPing: number;
}

export interface WebSocketMessage {
  type: 'connect' | 'status' | 'playback' | 'command' | 'ping';
  deviceId: string;
  data?: any;
}

export interface PlaybackStatus {
  currentTrack: string | null;
  position: number;
  isPlaying: boolean;
  volume: number;
  playlist: string | null;
}

export interface DeviceStatus {
  online: boolean;
  ip: string;
  version: string;
  systemInfo: {
    os: string;
    memory: {
      total: number;
      used: number;
    };
    storage: {
      total: number;
      used: number;
    };
    cpu: number;
  };
}