import { AppDataSource } from '../data-source';
import { Device } from '../entities/Device';
import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';
import { DeviceStatus } from '../websocket/types';
import { sendCommand } from '../websocket/handlers/deviceHandler';

interface DeviceMetrics {
  timestamp: string;
  cpu: number;
  memory_total: number;
  memory_used: number;
  storage_total: number;
  storage_used: number;
}

export class MonitoringService {
  private readonly deviceRepository = AppDataSource.getRepository(Device);
  private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute
  private readonly OFFLINE_THRESHOLD = 180000; // 3 minutes
  private readonly RECONNECT_ATTEMPTS = 3;
  private readonly RECONNECT_INTERVAL = 30000; // 30 seconds

  async startMonitoring() {
    setInterval(() => this.performHealthChecks(), this.HEALTH_CHECK_INTERVAL);
    logger.info('Device monitoring started');
  }

  private async performHealthChecks() {
    const devices = await this.deviceRepository.find({
      where: { isActive: true },
      relations: ['branch']
    });

    for (const device of devices) {
      try {
        await this.checkDeviceHealth(device);
      } catch (error) {
        logger.error(`Health check failed for device ${device.id}:`, error);
      }
    }
  }

  private async checkDeviceHealth(device: Device) {
    const status = await this.getDeviceStatus(device.id);
    const lastSeen = new Date(status?.lastSeen || 0);
    const timeSinceLastSeen = Date.now() - lastSeen.getTime();

    if (timeSinceLastSeen > this.OFFLINE_THRESHOLD) {
      await this.handleOfflineDevice(device);
    }

    // Store metrics
    await this.storeMetrics(device.id, status);
  }

  private async getDeviceStatus(deviceId: string): Promise<DeviceStatus | null> {
    const status = await redisClient.hGetAll(`device:${deviceId}`);
    return Object.keys(status).length ? JSON.parse(status.status) : null;
  }

  private async handleOfflineDevice(device: Device) {
    logger.warn(`Device ${device.id} is offline. Attempting reconnection...`);

    for (let attempt = 1; attempt <= this.RECONNECT_ATTEMPTS; attempt++) {
      try {
        const success = await this.attemptReconnect(device);
        if (success) {
          logger.info(`Device ${device.id} reconnected successfully`);
          return;
        }
      } catch (error) {
        logger.error(`Reconnection attempt ${attempt} failed for device ${device.id}:`, error);
      }

      await new Promise(resolve => setTimeout(resolve, this.RECONNECT_INTERVAL));
    }

    logger.error(`Failed to reconnect device ${device.id} after ${this.RECONNECT_ATTEMPTS} attempts`);
    await this.notifyDeviceFailure(device);
  }

  private async attemptReconnect(device: Device): Promise<boolean> {
    // Send reconnect command to device
    const success = await sendCommand(device.id, 'system:reconnect');
    
    if (success) {
      // Wait for device to reconnect
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check if device is back online
      const status = await this.getDeviceStatus(device.id);
      return status?.online || false;
    }

    return false;
  }

  private async storeMetrics(deviceId: string, status: DeviceStatus | null) {
    if (!status) return;

    const metrics: DeviceMetrics = {
      timestamp: new Date().toISOString(),
      cpu: status.systemInfo.cpu,
      memory_total: status.systemInfo.memory.total,
      memory_used: status.systemInfo.memory.used,
      storage_total: status.systemInfo.storage.total,
      storage_used: status.systemInfo.storage.used
    };

    // Convert metrics to Record type for Redis storage
    const redisMetrics: Record<string, string | number> = {
      timestamp: metrics.timestamp,
      cpu: metrics.cpu,
      memory_total: metrics.memory_total,
      memory_used: metrics.memory_used,
      storage_total: metrics.storage_total,
      storage_used: metrics.storage_used
    };

    // Store in Redis with TTL (24 hours)
    const key = `metrics:${deviceId}:${metrics.timestamp}`;
    await redisClient.hSet(key, redisMetrics);
    await redisClient.expire(key, 86400);

    // Check thresholds and alert if necessary
    await this.checkMetricThresholds(deviceId, metrics);
  }

  private async checkMetricThresholds(deviceId: string, metrics: DeviceMetrics) {
    const thresholds = {
      cpu: 80, // 80% CPU usage
      memory: 90, // 90% memory usage
      storage: 90 // 90% storage usage
    };

    const alerts = [];

    if (metrics.cpu > thresholds.cpu) {
      alerts.push(`High CPU usage: ${metrics.cpu}%`);
    }

    const memoryUsage = (metrics.memory_used / metrics.memory_total) * 100;
    if (memoryUsage > thresholds.memory) {
      alerts.push(`High memory usage: ${memoryUsage.toFixed(1)}%`);
    }

    const storageUsage = (metrics.storage_used / metrics.storage_total) * 100;
    if (storageUsage > thresholds.storage) {
      alerts.push(`High storage usage: ${storageUsage.toFixed(1)}%`);
    }

    if (alerts.length > 0) {
      await this.createAlert(deviceId, alerts);
    }
  }

  private async createAlert(deviceId: string, messages: string[]) {
    const alert = {
      deviceId,
      timestamp: new Date().toISOString(),
      messages,
      severity: 'warning'
    };

    // Store alert in Redis
    await redisClient.lPush(`alerts:${deviceId}`, JSON.stringify(alert));
    
    // Publish alert for real-time notifications
    await redisClient.publish('device:alert', JSON.stringify(alert));
    
    logger.warn(`Device ${deviceId} alerts:`, messages);
  }

  private async notifyDeviceFailure(device: Device) {
    const alert = {
      deviceId: device.id,
      branchId: device.branch.id,
      timestamp: new Date().toISOString(),
      type: 'device_failure',
      message: `Device ${device.name} is offline and failed to reconnect`,
      severity: 'critical'
    };

    // Store critical alert
    await redisClient.lPush(`alerts:${device.id}`, JSON.stringify(alert));
    
    // Publish alert for immediate handling
    await redisClient.publish('device:alert', JSON.stringify(alert));
    
    logger.error(`Device failure notification sent for ${device.id}`);
  }

  // Public methods for external use
  async getDeviceMetrics(deviceId: string, period: string = '1h'): Promise<DeviceMetrics[]> {
    const timeRange = this.getTimeRange(period);
    const metrics: DeviceMetrics[] = [];
    
    let cursor = 0;
    do {
      const result = await redisClient.scan(cursor, {
        MATCH: `metrics:${deviceId}:*`,
        COUNT: 100
      });
      
      cursor = result.cursor;
      
      for (const key of result.keys) {
        const timestamp = key.split(':')[2];
        if (new Date(timestamp) >= timeRange) {
          const metric = await redisClient.hGetAll(key);
          metrics.push({
            ...metric,
            timestamp,
            cpu: Number(metric.cpu),
            memory_total: Number(metric.memory_total),
            memory_used: Number(metric.memory_used),
            storage_total: Number(metric.storage_total),
            storage_used: Number(metric.storage_used)
          } as DeviceMetrics);
        }
      }
    } while (cursor !== 0);

    return metrics.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async getDeviceAlerts(deviceId: string, limit: number = 100): Promise<any[]> {
    const alerts = await redisClient.lRange(`alerts:${deviceId}`, 0, limit - 1);
    return alerts.map(alert => JSON.parse(alert));
  }

  async clearAlerts(deviceId: string): Promise<void> {
    await redisClient.del(`alerts:${deviceId}`);
    logger.info(`Cleared alerts for device ${deviceId}`);
  }

  private getTimeRange(period: string): Date {
    const now = new Date();
    const hours = parseInt(period);
    return new Date(now.getTime() - (hours * 60 * 60 * 1000));
  }
}