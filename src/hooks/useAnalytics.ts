import { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDeviceAnalytics = async (deviceId: string, period: string = '24h') => {
    try {
      setLoading(true);
      const data = await analyticsService.getDeviceAnalytics(deviceId, period);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to get device analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBranchAnalytics = async (branchId: string, period: string = '24h') => {
    try {
      setLoading(true);
      const data = await analyticsService.getBranchAnalytics(branchId, period);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to get branch analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPlaylistAnalytics = async (playlistId: string, period: string = '24h') => {
    try {
      setLoading(true);
      const data = await analyticsService.getPlaylistAnalytics(playlistId, period);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to get playlist analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSystemAnalytics = async (period: string = '24h') => {
    try {
      setLoading(true);
      const data = await analyticsService.getSystemAnalytics(period);
      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to get system analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportAnalytics = async (
    type: string,
    id: string,
    period: string = '24h',
    format: 'json' | 'csv' = 'json'
  ) => {
    try {
      setLoading(true);
      const data = await analyticsService.exportAnalytics(type, id, period, format);
      
      if (format === 'csv') {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-${id}-analytics.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      return data;
    } catch (err: any) {
      setError(err.message || 'Failed to export analytics');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getDeviceAnalytics,
    getBranchAnalytics,
    getPlaylistAnalytics,
    getSystemAnalytics,
    exportAnalytics
  };
};