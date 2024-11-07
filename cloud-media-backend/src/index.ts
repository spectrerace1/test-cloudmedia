import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { AppDataSource } from './data-source';
import { logger } from './utils/logger';
import { redisClient } from './utils/redis';
import { minioClient } from './utils/minio';
import { authRouter } from './routes/auth';
import { branchRouter } from './routes/branches';
import { deviceRouter } from './routes/devices';
import { playlistRouter } from './routes/playlists';
import { mediaRouter } from './routes/media';
import { scheduleRouter } from './routes/schedules';
import { monitoringRouter } from './routes/monitoring';
import { handleWebSocket } from './websocket';
import { errorHandler } from './middleware/errorHandler';
import { branchGroupRouter } from './routes/branchGroups';


const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/branches', branchRouter);
app.use('/api/devices', deviceRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/media', mediaRouter);
app.use('/api/schedules', scheduleRouter);
app.use('/api/monitoring', monitoringRouter);
app.use('/api/branch-groups', branchGroupRouter);
// Error handling
app.use(errorHandler);

// WebSocket handling
wss.on('connection', handleWebSocket);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    logger.info('Database connection established');

    // Initialize Redis connection
    await redisClient.connect();
    logger.info('Redis connection established');

    // Initialize MinIO connection
    await minioClient.listBuckets();
    logger.info('MinIO connection established');

    // Start server
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();