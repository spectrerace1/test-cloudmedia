import api from './axios';
import { Schedule } from '../../types/schedule';

export const scheduleService = {
  async createSchedule(scheduleData: {
    playlistId: string;
    branchId: string;
    schedule: any;
  }) {
    const { data } = await api.post<Schedule>('/schedules', scheduleData);
    return data;
  },

  async getAllSchedules() {
    const { data } = await api.get<Schedule[]>('/schedules');
    return data;
  },

  async getSchedule(id: string) {
    const { data } = await api.get<Schedule>(`/schedules/${id}`);
    return data;
  },

  async getBranchSchedules(branchId: string) {
    const { data } = await api.get<Schedule[]>(`/schedules/branch/${branchId}`);
    return data;
  },

  async updateSchedule(id: string, scheduleData: any) {
    const { data } = await api.patch<Schedule>(`/schedules/${id}`, scheduleData);
    return data;
  },

  async deleteSchedule(id: string) {
    await api.delete(`/schedules/${id}`);
    return true;
  },

  async getActiveSchedules() {
    const { data } = await api.get<Schedule[]>('/schedules/status/active');
    return data;
  }
};