import api from './axios';
import { Media } from '../../types/media';

export const mediaService = {
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<Media>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  async getAllMedia() {
    const { data } = await api.get<Media[]>('/media');
    return data;
  },

  async getMedia(id: string) {
    const { data } = await api.get<Media>(`/media/${id}`);
    return data;
  },

  async getStreamUrl(id: string) {
    const { data } = await api.get<{ url: string }>(`/media/${id}/stream`);
    return data.url;
  },

  async updateMedia(id: string, name: string) {
    const { data } = await api.patch<Media>(`/media/${id}`, { name });
    return data;
  },

  async deleteMedia(id: string) {
    await api.delete(`/media/${id}`);
    return true;
  },

  async getMetadata(id: string) {
    const { data } = await api.get(`/media/${id}/metadata`);
    return data;
  },

  async getMediaAnalytics(id: string, period: string = '24h') {
    const { data } = await api.get(`/analytics/media/${id}`, {
      params: { period }
    });
    return data;
  }
};