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

export interface DeviceStatus {
  online: boolean;
  lastSeen: string;
  ip: string;
  version: string;
  systemInfo: {
    os: string;
    cpu: number;
    memory: {
      total: number;
      used: number;
    };
    storage: {
      total: number;
      used: number;
    };
  };
}