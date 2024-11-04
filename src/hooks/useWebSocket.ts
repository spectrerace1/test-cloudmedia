import { useState, useEffect, useCallback } from 'react';
import { createWebSocketService } from '../services/api';

export const useWebSocket = (deviceId: string) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wsService, setWsService] = useState<ReturnType<typeof createWebSocketService> | null>(null);

  useEffect(() => {
    const service = createWebSocketService(deviceId);
    setWsService(service);

    service.onMessage('connect', () => {
      setConnected(true);
      setError(null);
    });

    service.onMessage('error', (data) => {
      setError(data.message);
    });

    service.connect();

    return () => {
      service.disconnect();
    };
  }, [deviceId]);

  const sendMessage = useCallback((type: string, data: any) => {
    if (wsService) {
      wsService.sendMessage(type, data);
    }
  }, [wsService]);

  const reconnect = useCallback(() => {
    if (wsService) {
      wsService.connect();
    }
  }, [wsService]);

  return {
    connected,
    error,
    sendMessage,
    reconnect
  };
};