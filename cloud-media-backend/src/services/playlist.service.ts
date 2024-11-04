import { AppDataSource } from '../data-source';
import { Playlist } from '../entities/Playlist';
import { Media } from '../entities/Media';
import { Branch } from '../entities/Branch';
import { AppError } from '../middleware/errorHandler';
import { CacheService } from './cache.service';
import { logger } from '../utils/logger';

const playlistRepository = AppDataSource.getRepository(Playlist);
const mediaRepository = AppDataSource.getRepository(Media);
const branchRepository = AppDataSource.getRepository(Branch);
const cacheService = new CacheService();

export class PlaylistService {
  async create(playlistData: Partial<Playlist>) {
    const playlist = playlistRepository.create({
      ...playlistData,
      settings: {
        shuffle: false,
        repeat: false,
        volume: 100,
        schedule: {
          enabled: false,
          startTime: '09:00',
          endTime: '18:00',
          days: ['mon', 'tue', 'wed', 'thu', 'fri']
        },
        ...playlistData.settings
      }
    });

    await playlistRepository.save(playlist);
    
    // Cache the new playlist
    await cacheService.setPlaylist(playlist.id, playlist);
    // Invalidate playlist list cache
    await cacheService.invalidateList('playlists');
    
    return playlist;
  }

  async findAll() {
    // Try to get from cache first
    const cached = await cacheService.getList('playlists');
    if (cached) {
      return cached;
    }

    const playlists = await playlistRepository.find({
      relations: ['media', 'branches'],
      where: { isActive: true }
    });

    // Cache the results
    await cacheService.setList('playlists', playlists);
    
    return playlists;
  }

  async findById(id: string) {
    // Try to get from cache first
    const cached = await cacheService.getPlaylist(id);
    if (cached) {
      return cached;
    }

    const playlist = await playlistRepository.findOne({
      where: { id },
      relations: ['media', 'branches']
    });

    if (!playlist) {
      throw new AppError(404, 'Playlist not found');
    }

    // Cache the result
    await cacheService.setPlaylist(id, playlist);
    
    return playlist;
  }

  async update(id: string, playlistData: Partial<Playlist>) {
    const playlist = await this.findById(id);
    playlistRepository.merge(playlist, playlistData);
    await playlistRepository.save(playlist);

    // Update cache
    await cacheService.setPlaylist(id, playlist);
    await cacheService.invalidateList('playlists');
    
    // Invalidate related branch caches
    for (const branch of playlist.branches) {
      await cacheService.invalidateBranch(branch.id);
    }

    return playlist;
  }

  async delete(id: string) {
    const playlist = await this.findById(id);
    playlist.isActive = false;
    await playlistRepository.save(playlist);

    // Invalidate caches
    await cacheService.invalidatePlaylist(id);
    await cacheService.invalidateList('playlists');
    
    // Invalidate related branch caches
    for (const branch of playlist.branches) {
      await cacheService.invalidateBranch(branch.id);
    }
  }

  async addMedia(id: string, mediaIds: string[]) {
    const playlist = await this.findById(id);
    const media = await mediaRepository.findByIds(mediaIds);

    if (media.length !== mediaIds.length) {
      throw new AppError(400, 'Some media items not found');
    }

    playlist.media = [...playlist.media, ...media];
    await playlistRepository.save(playlist);

    // Update cache
    await cacheService.setPlaylist(id, playlist);
    await cacheService.invalidateList('playlists');

    return playlist;
  }

  async removeMedia(id: string, mediaIds: string[]) {
    const playlist = await this.findById(id);
    playlist.media = playlist.media.filter(m => !mediaIds.includes(m.id));
    await playlistRepository.save(playlist);

    // Update cache
    await cacheService.setPlaylist(id, playlist);
    await cacheService.invalidateList('playlists');

    return playlist;
  }

  async assignToBranches(id: string, branchIds: string[]) {
    const playlist = await this.findById(id);
    const branches = await branchRepository.findByIds(branchIds);

    if (branches.length !== branchIds.length) {
      throw new AppError(400, 'Some branches not found');
    }

    playlist.branches = [...playlist.branches, ...branches];
    await playlistRepository.save(playlist);

    // Update caches
    await cacheService.setPlaylist(id, playlist);
    await cacheService.invalidateList('playlists');
    
    // Invalidate branch caches
    for (const branch of branches) {
      await cacheService.invalidateBranch(branch.id);
    }

    return playlist;
  }

  async removeBranches(id: string, branchIds: string[]) {
    const playlist = await this.findById(id);
    playlist.branches = playlist.branches.filter(b => !branchIds.includes(b.id));
    await playlistRepository.save(playlist);

    // Update caches
    await cacheService.setPlaylist(id, playlist);
    await cacheService.invalidateList('playlists');
    
    // Invalidate branch caches
    for (const branchId of branchIds) {
      await cacheService.invalidateBranch(branchId);
    }

    return playlist;
  }

  async updateSettings(id: string, settings: Playlist['settings']) {
    const playlist = await this.findById(id);
    playlist.settings = {
      ...playlist.settings,
      ...settings
    };
    await playlistRepository.save(playlist);

    // Update caches
    await cacheService.setPlaylist(id, playlist);
    await cacheService.invalidateList('playlists');

    return playlist;
  }
}