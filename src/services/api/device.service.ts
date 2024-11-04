import api from './axios';
import { Device } from '../../types/device';

export const deviceService = {
  async registerDevice(branchId: string, deviceData: Partial<Device>) {
    const { data } = await api.post<Device>(`/devices/register/${branchId}`, deviceData);
    return data;
  },

  async getAllDevices() {
    const { data } = await api.get<Device[]>('/devices');
    return data;
  },

  async getDevice(id: string) {
    const { data } = await api.get<Device>(`/devices/${id}`);
    return data;
  },

  async updateDevice(id: string, deviceData: Partial<Device>) {
    const { data } = await api.patch<Device>(`/devices/${id}`, deviceData);
    return data;
  },

  async deleteDevice(id: string) {
    await api.delete(`/devices/${id}`);
    return true;
  },

  async updateDeviceStatus(id: string, status: any) {
    const { data } = await api.patch<Device>(`/devices/${id}/status`, status);
    return data;
  },

  async getDevicePlayback(id: string) {
    const { data } = await api.get(`/devices/${id}/playback`);
    return data;
  },

  async getDeviceMetrics(id: string, period: string = '1h') {
    const { data } = await api.get(`/monitoring/metrics/${id}`, {
      params: { period }
    });
    return data;
  },

  async getDeviceAlerts(id: string, limit: number = 100) {
    const { data } = await api.get(`/monitoring/alerts/${id}`, {
      params: { limit }
    });
    return data;
  },

  async clearAlerts(id: string) {
    await api.delete(`/monitoring/alerts/${id}`);
    return true;
  },

  async sendCommand(id: string, command: string, data?: any) {
    const { data: response } = await api.post(`/devices/${id}/command`, {
      command,
      data
    });
    return response;
  },

  async getDeviceAnalytics(id: string, period: string = '24h') {
    const { data } = await api.get(`/analytics/device/${id}`, {
      params: { period }
    });
    return data;
  },

  async updateDeviceVolume(id: string, volume: number) {
    const { data } = await api.patch(`/devices/${id}/volume`, { volume });
    return data;
  },

  async restartDevice(id: string) {
    const { data } = await api.post(`/devices/${id}/restart`);
    return data;
  },

  async resetDevice(id: string) {
    const { data } = await api.post(`/devices/${id}/reset`);
    return data;
  }
};