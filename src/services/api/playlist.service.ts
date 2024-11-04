import api from './axios';
import { Playlist } from '../../types/playlist';

export const playlistService = {
  async createPlaylist(playlistData: Partial<Playlist>) {
    const { data } = await api.post<Playlist>('/playlists', playlistData);
    return data;
  },

  async getAllPlaylists() {
    const { data } = await api.get<Playlist[]>('/playlists');
    return data;
  },

  async getPlaylist(id: string) {
    const { data } = await api.get<Playlist>(`/playlists/${id}`);
    return data;
  },

  async updatePlaylist(id: string, playlistData: Partial<Playlist>) {
    const { data } = await api.patch<Playlist>(`/playlists/${id}`, playlistData);
    return data;
  },

  async deletePlaylist(id: string) {
    await api.delete(`/playlists/${id}`);
    return true;
  },

  async addMedia(id: string, mediaIds: string[]) {
    const { data } = await api.post(`/playlists/${id}/media`, { mediaIds });
    return data;
  },

  async removeMedia(id: string, mediaIds: string[]) {
    const { data } = await api.delete(`/playlists/${id}/media`, { 
      data: { mediaIds } 
    });
    return data;
  },

  async assignToBranches(id: string, branchIds: string[]) {
    const { data } = await api.post(`/playlists/${id}/branches`, { branchIds });
    return data;
  },

  async removeBranches(id: string, branchIds: string[]) {
    const { data } = await api.delete(`/playlists/${id}/branches`, {
      data: { branchIds }
    });
    return data;
  },

  async updateSettings(id: string, settings: any) {
    const { data } = await api.patch(`/playlists/${id}/settings`, settings);
    return data;
  },

  async getPlaylistAnalytics(id: string, period: string = '24h') {
    const { data } = await api.get(`/analytics/playlist/${id}`, {
      params: { period }
    });
    return data;
  }
};