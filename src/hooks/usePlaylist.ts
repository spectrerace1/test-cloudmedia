import { useState, useEffect } from 'react';
import { playlistService } from '../services/api';
import { Playlist } from '../types/playlist';

export const usePlaylist = (playlistId?: string) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (playlistId) {
      loadPlaylist(playlistId);
    } else {
      loadPlaylists();
    }
  }, [playlistId]);

  const loadPlaylist = async (id: string) => {
    try {
      setLoading(true);
      const data = await playlistService.getPlaylist(id);
      setPlaylist(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load playlist');
    } finally {
      setLoading(false);
    }
  };

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistService.getAllPlaylists();
      setPlaylists(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (playlistData: Partial<Playlist>) => {
    try {
      const newPlaylist = await playlistService.createPlaylist(playlistData);
      setPlaylists([...playlists, newPlaylist]);
      return newPlaylist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create playlist');
    }
  };

  const updatePlaylist = async (id: string, playlistData: Partial<Playlist>) => {
    try {
      const updatedPlaylist = await playlistService.updatePlaylist(id, playlistData);
      setPlaylists(playlists.map(p => p.id === id ? updatedPlaylist : p));
      if (playlist?.id === id) {
        setPlaylist(updatedPlaylist);
      }
      return updatedPlaylist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update playlist');
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await playlistService.deletePlaylist(id);
      setPlaylists(playlists.filter(p => p.id !== id));
      if (playlist?.id === id) {
        setPlaylist(null);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete playlist');
    }
  };

  const addMedia = async (id: string, mediaIds: string[]) => {
    try {
      const updatedPlaylist = await playlistService.addMedia(id, mediaIds);
      setPlaylists(playlists.map(p => p.id === id ? updatedPlaylist : p));
      if (playlist?.id === id) {
        setPlaylist(updatedPlaylist);
      }
      return updatedPlaylist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add media');
    }
  };

  const removeMedia = async (id: string, mediaIds: string[]) => {
    try {
      const updatedPlaylist = await playlistService.removeMedia(id, mediaIds);
      setPlaylists(playlists.map(p => p.id === id ? updatedPlaylist : p));
      if (playlist?.id === id) {
        setPlaylist(updatedPlaylist);
      }
      return updatedPlaylist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove media');
    }
  };

  const assignToBranches = async (id: string, branchIds: string[]) => {
    try {
      const updatedPlaylist = await playlistService.assignToBranches(id, branchIds);
      setPlaylists(playlists.map(p => p.id === id ? updatedPlaylist : p));
      if (playlist?.id === id) {
        setPlaylist(updatedPlaylist);
      }
      return updatedPlaylist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to assign to branches');
    }
  };

  const removeBranches = async (id: string, branchIds: string[]) => {
    try {
      const updatedPlaylist = await playlistService.removeBranches(id, branchIds);
      setPlaylists(playlists.map(p => p.id === id ? updatedPlaylist : p));
      if (playlist?.id === id) {
        setPlaylist(updatedPlaylist);
      }
      return updatedPlaylist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove branches');
    }
  };

  const updateSettings = async (id: string, settings: any) => {
    try {
      const updatedPlaylist = await playlistService.updateSettings(id, settings);
      setPlaylists(playlists.map(p => p.id === id ? updatedPlaylist : p));
      if (playlist?.id === id) {
        setPlaylist(updatedPlaylist);
      }
      return updatedPlaylist;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update settings');
    }
  };

  return {
    playlist,
    playlists,
    loading,
    error,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addMedia,
    removeMedia,
    assignToBranches,
    removeBranches,
    updateSettings,
    refresh: playlistId ? () => loadPlaylist(playlistId) : loadPlaylists
  };
};