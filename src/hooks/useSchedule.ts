import { useState, useEffect } from 'react';
import { scheduleService } from '../services/api';
import { Schedule } from '../types/schedule';

export const useSchedule = (scheduleId?: string) => {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scheduleId) {
      loadSchedule(scheduleId);
    } else {
      loadSchedules();
    }
  }, [scheduleId]);

  const loadSchedule = async (id: string) => {
    try {
      setLoading(true);
      const data = await scheduleService.getSchedule(id);
      setSchedule(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await scheduleService.getAllSchedules();
      setSchedules(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const createSchedule = async (scheduleData: {
    playlistId: string;
    branchId: string;
    schedule: any;
  }) => {
    try {
      const newSchedule = await scheduleService.createSchedule(scheduleData);
      setSchedules(prev => [...prev, newSchedule]);
      return newSchedule;
    } catch (err: any) {
      setError(err.message || 'Failed to create schedule');
      throw err;
    }
  };

  const updateSchedule = async (id: string, scheduleData: any) => {
    try {
      const updatedSchedule = await scheduleService.updateSchedule(id, scheduleData);
      setSchedules(prev => prev.map(s => s.id === id ? updatedSchedule : s));
      if (schedule?.id === id) {
        setSchedule(updatedSchedule);
      }
      return updatedSchedule;
    } catch (err: any) {
      setError(err.message || 'Failed to update schedule');
      throw err;
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      await scheduleService.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s.id !== id));
      if (schedule?.id === id) {
        setSchedule(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete schedule');
      throw err;
    }
  };

  const getBranchSchedules = async (branchId: string) => {
    try {
      return await scheduleService.getBranchSchedules(branchId);
    } catch (err: any) {
      setError(err.message || 'Failed to get branch schedules');
      throw err;
    }
  };

  const getActiveSchedules = async () => {
    try {
      return await scheduleService.getActiveSchedules();
    } catch (err: any) {
      setError(err.message || 'Failed to get active schedules');
      throw err;
    }
  };

  return {
    schedule,
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getBranchSchedules,
    getActiveSchedules,
    refresh: scheduleId ? () => loadSchedule(scheduleId) : loadSchedules
  };
};