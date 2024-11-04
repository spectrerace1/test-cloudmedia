import api from './axios';
import { Branch } from '../../types/branch';

export const branchService = {
  async getAllBranches() {
    const { data } = await api.get<Branch[]>('/branches');
    return data;
  },

  async getBranch(id: string) {
    const { data } = await api.get<Branch>(`/branches/${id}`);
    return data;
  },

  async createBranch(branchData: Partial<Branch>) {
    const { data } = await api.post<Branch>('/branches', branchData);
    return data;
  },

  async updateBranch(id: string, branchData: Partial<Branch>) {
    const { data } = await api.patch<Branch>(`/branches/${id}`, branchData);
    return data;
  },

  async deleteBranch(id: string) {
    await api.delete(`/branches/${id}`);
    return true;
  },

  async updateBranchSettings(id: string, settings: any) {
    const { data } = await api.patch<Branch>(`/branches/${id}/settings`, settings);
    return data;
  },

  async getBranchAnalytics(id: string, period: string = '24h') {
    const { data } = await api.get(`/analytics/branch/${id}`, {
      params: { period }
    });
    return data;
  },

  async getBranchDevices(id: string) {
    const { data } = await api.get(`/branches/${id}/devices`);
    return data;
  },

  async getBranchSchedules(id: string) {
    const { data } = await api.get(`/schedules/branch/${id}`);
    return data;
  },

  async getBranchPlaylists(id: string) {
    const { data } = await api.get(`/branches/${id}/playlists`);
    return data;
  },

  async updateBranchVolume(id: string, volume: number) {
    const { data } = await api.patch(`/branches/${id}/volume`, { volume });
    return data;
  },

  async emergencyStop(id: string, reason: string) {
    const { data } = await api.post(`/branches/${id}/emergency-stop`, { reason });
    return data;
  },

  async resumePlayback(id: string) {
    const { data } = await api.post(`/branches/${id}/resume`);
    return data;
  }
};