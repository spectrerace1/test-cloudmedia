import { AppDataSource } from '../data-source';
import { Media } from '../entities/Media';
import { AppError } from '../middleware/errorHandler';
import { minioClient } from '../utils/minio';
import { config } from '../config';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from './cache.service';

const mediaRepository = AppDataSource.getRepository(Media);
const cacheService = new CacheService();
const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export class MediaService {
  async upload(file: Express.Multer.File) {
    // Validate file
    if (!file) {
      throw new AppError(400, 'No file provided');
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new AppError(400, 'Invalid file type');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError(400, 'File too large');
    }

    // Generate unique filename
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `media/${fileName}`;

    // Upload to MinIO
    await minioClient.putObject(
      config.minio.bucket,
      filePath,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype }
    );

    // Create readable stream from buffer for audio duration calculation
    const bufferStream = new Readable();
    bufferStream.push(file.buffer);
    bufferStream.push(null);

    // Get audio metadata
    const duration = await getAudioDurationInSeconds(bufferStream);
    
    // Create media record
    const media = mediaRepository.create({
      name: file.originalname,
      type: file.mimetype,
      path: filePath,
      size: file.size,
      metadata: {
        duration,
        format: fileExt,
        bitrate: Math.round(file.size / duration)
      }
    });

    await mediaRepository.save(media);
    
    // Cache the new media
    await cacheService.setMedia(media.id, media);
    await cacheService.invalidateList('media');

    return media;
  }

  async findAll() {
    // Try to get from cache
    const cached = await cacheService.getList('media');
    if (cached) return cached;

    const media = await mediaRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });

    // Cache the results
    await cacheService.setList('media', media);
    
    return media;
  }

  async findById(id: string) {
    // Try to get from cache
    const cached = await cacheService.getMedia(id);
    if (cached) return cached;

    const media = await mediaRepository.findOne({
      where: { id }
    });

    if (!media) {
      throw new AppError(404, 'Media not found');
    }

    // Cache the result
    await cacheService.setMedia(id, media);
    
    return media;
  }

  async getStreamUrl(id: string) {
    const media = await this.findById(id);
    
    // Generate presigned URL for streaming
    const url = await minioClient.presignedGetObject(
      config.minio.bucket,
      media.path,
      60 * 60 // 1 hour expiry
    );

    return url;
  }

  async delete(id: string) {
    const media = await this.findById(id);
    
    // Delete from MinIO
    await minioClient.removeObject(config.minio.bucket, media.path);
    
    // Soft delete from database
    media.isActive = false;
    await mediaRepository.save(media);

    // Invalidate caches
    await cacheService.invalidateMedia(id);
    await cacheService.invalidateList('media');
  }

  async update(id: string, name: string) {
    const media = await this.findById(id);
    media.name = name;
    await mediaRepository.save(media);

    // Update cache
    await cacheService.setMedia(id, media);
    await cacheService.invalidateList('media');

    return media;
  }

  async getMetadata(id: string) {
    const media = await this.findById(id);
    return media.metadata;
  }

  async validateFiles(fileIds: string[]) {
    const files = await mediaRepository.findByIds(fileIds);
    
    if (files.length !== fileIds.length) {
      throw new AppError(400, 'Some media files not found');
    }

    return files;
  }

  async getTotalDuration(fileIds: string[]) {
    const files = await this.validateFiles(fileIds);
    return files.reduce((total, file) => total + (file.metadata?.duration || 0), 0);
  }

  async getTotalSize(fileIds: string[]) {
    const files = await this.validateFiles(fileIds);
    return files.reduce((total, file) => total + file.size, 0);
  }
}