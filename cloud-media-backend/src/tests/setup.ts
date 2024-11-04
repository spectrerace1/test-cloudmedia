import dotenv from 'dotenv';
import { join } from 'path';

// Load test environment variables
dotenv.config({ path: join(__dirname, '../../.env.test') });

// Global test setup
jest.setTimeout(30000); // 30 second timeout

// Mock Redis client
jest.mock('../utils/redis', () => ({
  redisClient: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    hSet: jest.fn(),
    hGet: jest.fn(),
    hGetAll: jest.fn(),
    publish: jest.fn()
  }
}));