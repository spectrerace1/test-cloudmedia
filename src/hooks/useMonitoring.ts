import { useState, useEffect } from 'react';
import { monitoringService } from '../services/api';

export const useMonitoring = (deviceId?: string) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deviceId) {
      loadMetrics();
      loadAlerts();
      const interval = setInterval(loadMetrics, 60000); // Update metrics every minute
      return () => clearInterval(interval);
    }
  }, [deviceId]);

  const loadMetrics = async () => {
    if (!deviceId) return;
    try {
      setLoading(true);
      const data = await monitoringService.getDeviceMetrics(deviceId);
      setMetrics(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  const loadAlerts = async () => {
    if (!deviceId) return;
    try {
      const data = await monitoringService.getDeviceAlerts(deviceId);
      setAlerts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load alerts');
    }
  };

  const clearAlerts = async () => {
    if (!deviceId) return;
    try {
      await monitoringService.clearAlerts(deviceId);
      setAlerts([]);
    } catch (err: any) {
      setError(err.message || 'Failed to clear alerts');
    }
  };

  return {
    metrics,
    alerts,
    loading,
    error,
    refresh: loadMetrics,
    clearAlerts
  };
};