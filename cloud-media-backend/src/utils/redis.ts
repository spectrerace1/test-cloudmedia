import { createClient } from 'redis';
import { config } from '../config';
import { logger } from './logger';

export const redisClient = createClient({
  url: config.redis.url
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});