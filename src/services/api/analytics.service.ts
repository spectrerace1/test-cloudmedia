import api from './axios';

export const analyticsService = {
  async getDeviceAnalytics(deviceId: string, period: string = '24h') {
    const { data } = await api.get(`/analytics/device/${deviceId}`, {
      params: { period }
    });
    return data;
  },

  async getBranchAnalytics(branchId: string, period: string = '24h') {
    const { data } = await api.get(`/analytics/branch/${branchId}`, {
      params: { period }
    });
    return data;
  },

  async getPlaylistAnalytics(playlistId: string, period: string = '24h') {
    const { data } = await api.get(`/analytics/playlist/${playlistId}`, {
      params: { period }
    });
    return data;
  },

  async getSystemAnalytics(period: string = '24h') {
    const { data } = await api.get('/analytics/system', {
      params: { period }
    });
    return data;
  },

  async exportAnalytics(type: string, id: string, period: string = '24h', format: 'json' | 'csv' = 'json') {
    const { data } = await api.get(`/analytics/export/${type}/${id}`, {
      params: { period, format },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    return data;
  }
};