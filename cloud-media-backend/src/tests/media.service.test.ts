import { MediaService } from '../services/media.service';
import { AppDataSource } from '../data-source';
import { minioClient } from '../utils/minio';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';

describe('MediaService', () => {
  let mediaService: MediaService;

  beforeAll(async () => {
    await AppDataSource.initialize();
    mediaService = new MediaService();

    // Create test bucket if not exists
    const bucketExists = await minioClient.bucketExists(config.minio.bucket);
    if (!bucketExists) {
      await minioClient.makeBucket(config.minio.bucket, 'us-east-1');
    }
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe('upload', () => {
    it('should upload a valid audio file', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test-audio.mp3',
        encoding: '7bit',
        mimetype: 'audio/mpeg',
        buffer: Buffer.from('mock audio data'),
        size: 1024 * 1024, // 1MB
        destination: '',
        filename: '',
        path: '',
        stream: null as any
      };

      const result = await mediaService.upload(mockFile);

      expect(result).toBeDefined();
      expect(result.name).toBe('test-audio.mp3');
      expect(result.type).toBe('audio/mpeg');
      expect(result.size).toBe(1024 * 1024);
      expect(result.metadata).toBeDefined();
    });

    it('should reject invalid file type', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        buffer: Buffer.from('test data'),
        size: 1024,
        destination: '',
        filename: '',
        path: '',
        stream: null as any
      };

      await expect(mediaService.upload(mockFile)).rejects.toThrow(AppError);
    });

    it('should reject file exceeding size limit', async () => {
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'large-audio.mp3',
        encoding: '7bit',
        mimetype: 'audio/mpeg',
        buffer: Buffer.alloc(101 * 1024 * 1024), // 101MB
        size: 101 * 1024 * 1024,
        destination: '',
        filename: '',
        path: '',
        stream: null as any
      };

      await expect(mediaService.upload(mockFile)).rejects.toThrow(AppError);
    });
  });

  describe('getStreamUrl', () => {
    it('should generate a valid streaming URL', async () => {
      const mediaId = 'test-id'; // Use a valid media ID from your database
      const url = await mediaService.getStreamUrl(mediaId);
      
      expect(url).toBeDefined();
      expect(typeof url).toBe('string');
      expect(url).toContain(config.minio.endpoint);
    });

    it('should throw error for non-existent media', async () => {
      await expect(mediaService.getStreamUrl('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('metadata', () => {
    it('should return correct metadata for media file', async () => {
      const mediaId = 'test-id'; // Use a valid media ID from your database
      const metadata = await mediaService.getMetadata(mediaId);
      
      expect(metadata).toBeDefined();
      expect(metadata).toHaveProperty('duration');
      expect(metadata).toHaveProperty('format');
      expect(metadata).toHaveProperty('bitrate');
    });
  });
});