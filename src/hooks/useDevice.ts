import { useState, useEffect } from 'react';
import { deviceService } from '../services/api';
import { Device } from '../types/device';

export const useDevice = (deviceId?: string) => {
  const [device, setDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (deviceId) {
      loadDevice(deviceId);
    } else {
      loadDevices();
    }
  }, [deviceId]);

  const loadDevice = async (id: string) => {
    try {
      setLoading(true);
      const data = await deviceService.getDevice(id);
      setDevice(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load device');
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      setLoading(true);
      const data = await deviceService.getAllDevices();
      setDevices(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const registerDevice = async (branchId: string, deviceData: Partial<Device>) => {
    try {
      const newDevice = await deviceService.registerDevice(branchId, deviceData);
      setDevices([...devices, newDevice]);
      return newDevice;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to register device');
    }
  };

  const updateDevice = async (id: string, deviceData: Partial<Device>) => {
    try {
      const updatedDevice = await deviceService.updateDevice(id, deviceData);
      setDevices(devices.map(d => d.id === id ? updatedDevice : d));
      if (device?.id === id) {
        setDevice(updatedDevice);
      }
      return updatedDevice;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update device');
    }
  };

  const deleteDevice = async (id: string) => {
    try {
      await deviceService.deleteDevice(id);
      setDevices(devices.filter(d => d.id !== id));
      if (device?.id === id) {
        setDevice(null);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete device');
    }
  };

  const updateDeviceStatus = async (id: string, status: any) => {
    try {
      const updatedDevice = await deviceService.updateDeviceStatus(id, status);
      setDevices(devices.map(d => d.id === id ? updatedDevice : d));
      if (device?.id === id) {
        setDevice(updatedDevice);
      }
      return updatedDevice;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update device status');
    }
  };

  const getDevicePlayback = async (id: string) => {
    try {
      return await deviceService.getDevicePlayback(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get device playback');
    }
  };

  return {
    device,
    devices,
    loading,
    error,
    registerDevice,
    updateDevice,
    deleteDevice,
    updateDeviceStatus,
    getDevicePlayback,
    refresh: deviceId ? () => loadDevice(deviceId) : loadDevices
  };
};