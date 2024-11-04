import { redisClient } from '../utils/redis';
import { logger } from '../utils/logger';

export class CacheService {
  private readonly DEFAULT_TTL = 3600; // 1 hour
  private readonly CACHE_PREFIX = 'cache:';

  // Generic cache methods
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(this.CACHE_PREFIX + key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
    try {
      const data = JSON.stringify(value);
      await redisClient.set(this.CACHE_PREFIX + key, data, { EX: ttl });
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await redisClient.del(this.CACHE_PREFIX + key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  // Pattern-based cache invalidation
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      let cursor = 0;
      do {
        const [nextCursor, keys] = await redisClient.scan(
          cursor,
          'MATCH',
          this.CACHE_PREFIX + pattern,
          'COUNT',
          100
        );
        cursor = parseInt(nextCursor);
        
        if (keys.length) {
          await redisClient.del(keys);
        }
      } while (cursor !== 0);
    } catch (error) {
      logger.error('Cache pattern invalidation error:', error);
    }
  }

  // Playlist specific caching
  async getPlaylist(id: string) {
    return this.get<any>(`playlist:${id}`);
  }

  async setPlaylist(id: string, data: any) {
    await this.set(`playlist:${id}`, data, 3600); // 1 hour TTL
  }

  async invalidatePlaylist(id: string) {
    await this.invalidatePattern(`playlist:${id}*`);
  }

  // Branch specific caching
  async getBranch(id: string) {
    return this.get<any>(`branch:${id}`);
  }

  async setBranch(id: string, data: any) {
    await this.set(`branch:${id}`, data, 1800); // 30 minutes TTL
  }

  async invalidateBranch(id: string) {
    await this.invalidatePattern(`branch:${id}*`);
  }

  // Device specific caching
  async getDevice(id: string) {
    return this.get<any>(`device:${id}`);
  }

  async setDevice(id: string, data: any) {
    await this.set(`device:${id}`, data, 300); // 5 minutes TTL for devices
  }

  async invalidateDevice(id: string) {
    await this.invalidatePattern(`device:${id}*`);
  }

  // Media specific caching
  async getMedia(id: string) {
    return this.get<any>(`media:${id}`);
  }

  async setMedia(id: string, data: any) {
    await this.set(`media:${id}`, data, 7200); // 2 hours TTL
  }

  async invalidateMedia(id: string) {
    await this.invalidatePattern(`media:${id}*`);
  }

  // List caching
  async getList(type: string) {
    return this.get<any[]>(`list:${type}`);
  }

  async setList(type: string, data: any[]) {
    await this.set(`list:${type}`, data, 600); // 10 minutes TTL for lists
  }

  async invalidateList(type: string) {
    await this.del(`list:${type}`);
  }

  // Schedule caching
  async getSchedule(id: string) {
    return this.get<any>(`schedule:${id}`);
  }

  async setSchedule(id: string, data: any) {
    const ttl = this.calculateScheduleTTL(data);
    await this.set(`schedule:${id}`, data, ttl);
  }

  private calculateScheduleTTL(schedule: any): number {
    if (!schedule.endDate) return this.DEFAULT_TTL;
    
    const endDate = new Date(schedule.endDate);
    const now = new Date();
    const ttl = Math.floor((endDate.getTime() - now.getTime()) / 1000);
    
    return ttl > 0 ? ttl : 0;
  }

  // Metrics caching
  async setMetrics(deviceId: string, metrics: any) {
    const key = `metrics:${deviceId}:${new Date().toISOString()}`;
    await this.set(key, metrics, 86400); // 24 hours TTL
  }

  async getMetricsByTimeRange(deviceId: string, startTime: Date, endTime: Date) {
    const metrics = [];
    let cursor = 0;
    
    do {
      const [nextCursor, keys] = await redisClient.scan(
        cursor,
        'MATCH',
        `${this.CACHE_PREFIX}metrics:${deviceId}:*`,
        'COUNT',
        100
      );
      
      cursor = parseInt(nextCursor);
      
      for (const key of keys) {
        const timestamp = key.split(':')[3];
        const time = new Date(timestamp);
        
        if (time >= startTime && time <= endTime) {
          const metric = await this.get(key.replace(this.CACHE_PREFIX, ''));
          if (metric) metrics.push(metric);
        }
      }
    } while (cursor !== 0);

    return metrics;
  }

  // Cache warming methods
  async warmupCache(type: string, id: string, data: any) {
    switch (type) {
      case 'playlist':
        await this.setPlaylist(id, data);
        break;
      case 'branch':
        await this.setBranch(id, data);
        break;
      case 'device':
        await this.setDevice(id, data);
        break;
      case 'media':
        await this.setMedia(id, data);
        break;
      case 'schedule':
        await this.setSchedule(id, data);
        break;
      default:
        logger.warn(`Unknown cache type: ${type}`);
    }
  }

  // Bulk operations
  async bulkInvalidate(patterns: string[]): Promise<void> {
    await Promise.all(patterns.map(pattern => this.invalidatePattern(pattern)));
  }

  // Cache health check
  async checkCacheHealth(): Promise<boolean> {
    try {
      const testKey = this.CACHE_PREFIX + 'health:test';
      await redisClient.set(testKey, '1', { EX: 10 });
      const result = await redisClient.get(testKey);
      await redisClient.del(testKey);
      return result === '1';
    } catch (error) {
      logger.error('Cache health check failed:', error);
      return false;
    }
  }
}