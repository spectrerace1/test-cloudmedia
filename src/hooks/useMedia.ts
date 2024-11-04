import { useState, useEffect } from 'react';
import { mediaService } from '../services/api';
import { Media } from '../types/media';

export const useMedia = (mediaId?: string) => {
  const [media, setMedia] = useState<Media | null>(null);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mediaId) {
      loadMedia(mediaId);
    } else {
      loadAllMedia();
    }
  }, [mediaId]);

  const loadMedia = async (id: string) => {
    try {
      setLoading(true);
      const data = await mediaService.getMedia(id);
      setMedia(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const loadAllMedia = async () => {
    try {
      setLoading(true);
      const data = await mediaService.getAllMedia();
      setMediaList(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load media list');
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (file: File) => {
    try {
      const newMedia = await mediaService.uploadMedia(file);
      setMediaList([...mediaList, newMedia]);
      return newMedia;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload media');
    }
  };

  const updateMedia = async (id: string, name: string) => {
    try {
      const updatedMedia = await mediaService.updateMedia(id, name);
      setMediaList(mediaList.map(m => m.id === id ? updatedMedia : m));
      if (media?.id === id) {
        setMedia(updatedMedia);
      }
      return updatedMedia;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update media');
    }
  };

  const deleteMedia = async (id: string) => {
    try {
      await mediaService.deleteMedia(id);
      setMediaList(mediaList.filter(m => m.id !== id));
      if (media?.id === id) {
        setMedia(null);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete media');
    }
  };

  const getStreamUrl = async (id: string) => {
    try {
      return await mediaService.getStreamUrl(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get stream URL');
    }
  };

  const getMetadata = async (id: string) => {
    try {
      return await mediaService.getMetadata(id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get metadata');
    }
  };

  return {
    media,
    mediaList,
    loading,
    error,
    uploadMedia,
    updateMedia,
    deleteMedia,
    getStreamUrl,
    getMetadata,
    refresh: mediaId ? () => loadMedia(mediaId) : loadAllMedia
  };
};