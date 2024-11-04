import api from './axios';

export const monitoringService = {
  async getDeviceMetrics(deviceId: string, period: string = '1h') {
    const { data } = await api.get(`/monitoring/metrics/${deviceId}`, {
      params: { period }
    });
    return data;
  },

  async getDeviceAlerts(deviceId: string, limit: number = 100) {
    const { data } = await api.get(`/monitoring/alerts/${deviceId}`, {
      params: { limit }
    });
    return data;
  },

  async clearAlerts(deviceId: string) {
    await api.delete(`/monitoring/alerts/${deviceId}`);
    return true;
  }
};