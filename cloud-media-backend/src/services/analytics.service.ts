import { AppDataSource } from '../data-source';
import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';
import { Device } from '../entities/Device';
import { Branch } from '../entities/Branch';
import { Playlist } from '../entities/Playlist';
import { Media } from '../entities/Media';

export class AnalyticsService {
  private readonly deviceRepository = AppDataSource.getRepository(Device);
  private readonly branchRepository = AppDataSource.getRepository(Branch);
  private readonly playlistRepository = AppDataSource.getRepository(Playlist);
  private readonly mediaRepository = AppDataSource.getRepository(Media);

  // Playback Analytics
  async trackPlayback(deviceId: string, mediaId: string, duration: number) {
    const key = `analytics:playback:${mediaId}`;
    const timestamp = new Date().toISOString();

    await redisClient.hIncrBy(key, 'playCount', 1);
    await redisClient.hIncrBy(key, 'totalDuration', duration);
    await redisClient.hSet(key, 'lastPlayed', timestamp);

    // Store detailed playback record
    const playbackRecord = {
      deviceId,
      mediaId,
      duration,
      timestamp
    };

    await redisClient.lPush('analytics:playback:history', JSON.stringify(playbackRecord));
    await redisClient.lTrim('analytics:playback:history', 0, 9999); // Keep last 10000 records
  }

  async getMediaPlaybackStats(mediaId: string) {
    const key = `analytics:playback:${mediaId}`;
    const stats = await redisClient.hGetAll(key);

    return {
      playCount: parseInt(stats.playCount || '0'),
      totalDuration: parseInt(stats.totalDuration || '0'),
      lastPlayed: stats.lastPlayed || null
    };
  }

  // Device Analytics
  async trackDeviceStatus(deviceId: string, status: any) {
    const key = `analytics:device:${deviceId}`;
    const timestamp = new Date().toISOString();

    await redisClient.hSet(key, {
      lastStatus: JSON.stringify(status),
      lastUpdate: timestamp
    });

    // Store status history
    const statusRecord = {
      ...status,
      timestamp
    };

    await redisClient.lPush(`analytics:device:${deviceId}:history`, JSON.stringify(statusRecord));
    await redisClient.lTrim(`analytics:device:${deviceId}:history`, 0, 999); // Keep last 1000 records
  }

  async getDeviceAnalytics(deviceId: string, period: string = '24h') {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
      relations: ['branch']
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const timeRange = this.getTimeRange(period);
    const history = await this.getDeviceHistory(deviceId, timeRange);

    return {
      device: {
        id: device.id,
        name: device.name,
        branch: device.branch.name
      },
      metrics: this.calculateDeviceMetrics(history),
      history
    };
  }

  // Branch Analytics
  async getBranchAnalytics(branchId: string, period: string = '24h') {
    const branch = await this.branchRepository.findOne({
      where: { id: branchId },
      relations: ['devices']
    });

    if (!branch) {
      throw new Error('Branch not found');
    }

    const timeRange = this.getTimeRange(period);
    const deviceAnalytics = await Promise.all(
      branch.devices.map(device => this.getDeviceAnalytics(device.id, period))
    );

    return {
      branch: {
        id: branch.id,
        name: branch.name,
        deviceCount: branch.devices.length
      },
      devices: deviceAnalytics,
      summary: this.calculateBranchSummary(deviceAnalytics)
    };
  }

  // Playlist Analytics
  async trackPlaylistAssignment(playlistId: string, branchId: string) {
    const key = `analytics:playlist:${playlistId}`;
    const timestamp = new Date().toISOString();

    await redisClient.hIncrBy(key, 'assignmentCount', 1);
    await redisClient.hSet(key, 'lastAssigned', timestamp);

    // Store assignment history
    const assignmentRecord = {
      playlistId,
      branchId,
      timestamp
    };

    await redisClient.lPush('analytics:playlist:assignments', JSON.stringify(assignmentRecord));
    await redisClient.lTrim('analytics:playlist:assignments', 0, 999);
  }

  async getPlaylistAnalytics(playlistId: string, period: string = '24h') {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId },
      relations: ['media', 'branches']
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const timeRange = this.getTimeRange(period);
    const mediaStats = await Promise.all(
      playlist.media.map(media => this.getMediaPlaybackStats(media.id))
    );

    return {
      playlist: {
        id: playlist.id,
        name: playlist.name,
        mediaCount: playlist.media.length,
        branchCount: playlist.branches.length
      },
      mediaStats,
      usage: await this.getPlaylistUsageStats(playlistId, timeRange)
    };
  }

  // System Analytics
  async getSystemAnalytics(period: string = '24h') {
    const timeRange = this.getTimeRange(period);

    const [devices, branches, playlists, media] = await Promise.all([
      this.deviceRepository.count({ where: { isActive: true } }),
      this.branchRepository.count({ where: { isActive: true } }),
      this.playlistRepository.count({ where: { isActive: true } }),
      this.mediaRepository.count({ where: { isActive: true } })
    ]);

    const deviceStatus = await this.getSystemDeviceStatus();
    const playbackStats = await this.getSystemPlaybackStats(timeRange);
    const storageStats = await this.getSystemStorageStats();

    return {
      counts: {
        devices,
        branches,
        playlists,
        media
      },
      deviceStatus,
      playbackStats,
      storageStats
    };
  }

  // Helper Methods
  private getTimeRange(period: string): Date {
    const now = new Date();
    const match = period.match(/^(\d+)([hdwm])$/);
    
    if (!match) {
      throw new Error('Invalid period format. Use format: 24h, 7d, 4w, 1m');
    }

    const [, amount, unit] = match;
    const value = parseInt(amount);

    switch (unit) {
      case 'h':
        return new Date(now.getTime() - value * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
      case 'w':
        return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
      case 'm':
        return new Date(now.getTime() - value * 30 * 24 * 60 * 60 * 1000);
      default:
        throw new Error('Invalid time unit');
    }
  }

  private async getDeviceHistory(deviceId: string, since: Date) {
    const history = await redisClient.lRange(
      `analytics:device:${deviceId}:history`,
      0,
      -1
    );

    return history
      .map(record => JSON.parse(record))
      .filter(record => new Date(record.timestamp) >= since);
  }

  private calculateDeviceMetrics(history: any[]) {
    if (history.length === 0) return null;

    const cpuUsage = history.reduce((sum, record) => sum + record.systemInfo.cpu, 0) / history.length;
    const memoryUsage = history.reduce((sum, record) => sum + record.systemInfo.memory.used, 0) / history.length;
    const uptime = history.filter(record => record.online).length / history.length * 100;

    return {
      averageCpuUsage: Math.round(cpuUsage * 100) / 100,
      averageMemoryUsage: Math.round(memoryUsage * 100) / 100,
      uptime: Math.round(uptime * 100) / 100
    };
  }

  private calculateBranchSummary(deviceAnalytics: any[]) {
    const onlineDevices = deviceAnalytics.filter(
      device => device.metrics && device.metrics.uptime > 0
    ).length;

    const averageUptime = deviceAnalytics.reduce(
      (sum, device) => sum + (device.metrics?.uptime || 0),
      0
    ) / deviceAnalytics.length;

    return {
      onlineDevices,
      totalDevices: deviceAnalytics.length,
      averageUptime: Math.round(averageUptime * 100) / 100
    };
  }

  private async getPlaylistUsageStats(playlistId: string, since: Date) {
    const assignments = await redisClient.lRange('analytics:playlist:assignments', 0, -1);
    
    const filteredAssignments = assignments
      .map(record => JSON.parse(record))
      .filter(record => 
        record.playlistId === playlistId && 
        new Date(record.timestamp) >= since
      );

    return {
      totalAssignments: filteredAssignments.length,
      uniqueBranches: new Set(filteredAssignments.map(a => a.branchId)).size,
      lastAssigned: filteredAssignments[0]?.timestamp || null
    };
  }

  private async getSystemDeviceStatus() {
    const devices = await this.deviceRepository.find({
      where: { isActive: true },
      relations: ['branch']
    });

    const status = {
      online: 0,
      offline: 0,
      byBranch: new Map()
    };

    for (const device of devices) {
      const deviceStatus = await redisClient.hGet(`device:${device.id}`, 'status');
      const isOnline = deviceStatus === 'online';

      if (isOnline) status.online++;
      else status.offline++;

      const branchStats = status.byBranch.get(device.branch.id) || { online: 0, offline: 0 };
      if (isOnline) branchStats.online++;
      else branchStats.offline++;
      
      status.byBranch.set(device.branch.id, branchStats);
    }

    return {
      total: devices.length,
      online: status.online,
      offline: status.offline,
      byBranch: Object.fromEntries(status.byBranch)
    };
  }

  private async getSystemPlaybackStats(since: Date) {
    const history = await redisClient.lRange('analytics:playback:history', 0, -1);
    
    const filteredHistory = history
      .map(record => JSON.parse(record))
      .filter(record => new Date(record.timestamp) >= since);

    return {
      totalPlays: filteredHistory.length,
      totalDuration: filteredHistory.reduce((sum, record) => sum + record.duration, 0),
      uniqueMedia: new Set(filteredHistory.map(record => record.mediaId)).size,
      uniqueDevices: new Set(filteredHistory.map(record => record.deviceId)).size
    };
  }

  private async getSystemStorageStats() {
    const media = await this.mediaRepository.find({ where: { isActive: true } });
    
    const totalSize = media.reduce((sum, file) => sum + file.size, 0);
    const averageSize = totalSize / media.length;

    return {
      totalFiles: media.length,
      totalSize,
      averageSize,
      byType: media.reduce((acc, file) => {
        acc[file.type] = (acc[file.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Export Methods
  async exportAnalytics(type: string, id: string, period: string = '24h', format: 'json' | 'csv' = 'json') {
    let data;

    switch (type) {
      case 'device':
        data = await this.getDeviceAnalytics(id, period);
        break;
      case 'branch':
        data = await this.getBranchAnalytics(id, period);
        break;
      case 'playlist':
        data = await this.getPlaylistAnalytics(id, period);
        break;
      case 'system':
        data = await this.getSystemAnalytics(period);
        break;
      default:
        throw new Error('Invalid analytics type');
    }

    return format === 'csv' ? this.convertToCsv(data) : data;
  }

  private convertToCsv(data: any): string {
    // Implement CSV conversion logic based on data structure
    // This is a simplified example
    const flatten = (obj: any, prefix = ''): Record<string, string> => {
      return Object.keys(obj).reduce((acc: Record<string, string>, k: string) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
          Object.assign(acc, flatten(obj[k], pre + k));
        } else {
          acc[pre + k] = obj[k];
        }
        return acc;
      }, {});
    };

    const flatData = flatten(data);
    const headers = Object.keys(flatData);
    const values = Object.values(flatData);

    return [
      headers.join(','),
      values.join(',')
    ].join('\n');
  }
}