import { Client } from 'minio';
import { config } from '../config';

export const minioClient = new Client({
  endPoint: config.minio.endpoint,
  port: config.minio.port,
  useSSL: config.env === 'production',
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey
});