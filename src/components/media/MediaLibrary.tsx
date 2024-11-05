import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music2, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Plus } from 'lucide-react';
import { mockPlaylists } from './mockData';
import MediaLibraryLoader from './MediaLibraryLoader';
import CreatePlaylistModal from './CreatePlaylistModal';

const MediaLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'all' | 'recent' | 'favorites'>('all');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePlay = (e: React.MouseEvent, playlistId: number) => {
    e.stopPropagation();
    if (playingId === playlistId) {
      setPlayingId(null);
      setCurrentSongIndex(0);
    } else {
      setPlayingId(playlistId);
      setCurrentSongIndex(0);
    }
  };

  const handlePlaylistClick = (playlistId: number) => {
    navigate(`/media/playlist/${playlistId}`);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * duration;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePreviousSong = () => {
    if (playingId) {
      const playlist = mockPlaylists.find(p => p.id === playingId);
      if (playlist) {
        if (currentSongIndex > 0) {
          setCurrentSongIndex(currentSongIndex - 1);
        } else {
          setCurrentSongIndex(playlist.songCount - 1);
        }
      }
    }
  };

  const handleNextSong = () => {
    if (playingId) {
      const playlist = mockPlaylists.find(p => p.id === playingId);
      if (playlist) {
        if (currentSongIndex < playlist.songCount - 1) {
          setCurrentSongIndex(currentSongIndex + 1);
        } else {
          setCurrentSongIndex(0);
        }
      }
    }
  };

  const filteredPlaylists = mockPlaylists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    playlist.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    playlist.mood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <MediaLibraryLoader />;
  }

  const currentPlaylist = playingId ? mockPlaylists.find(p => p.id === playingId) : null;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600 mt-1">Manage and organize your music collection</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Playlist
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              currentFilter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCurrentFilter('recent')}
            className={`px-4 py-2 rounded-lg ${
              currentFilter === 'recent'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setCurrentFilter('favorites')}
            className={`px-4 py-2 rounded-lg ${
              currentFilter === 'favorites'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Playlist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredPlaylists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="group cursor-pointer"
            onClick={() => handlePlaylistClick(playlist.id)}
          >
            <div className="relative aspect-square mb-3">
              <img
                src={playlist.artwork}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={(e) => handlePlay(e, playlist.id)}
                  className="p-3 bg-white rounded-full hover:scale-105 transition-transform"
                >
                  {playingId === playlist.id ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <h4 className="font-medium text-gray-900 truncate">{playlist.name}</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">{playlist.category}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500">{playlist.mood}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Player Bar */}
      {playingId && currentPlaylist && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-[1600px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={currentPlaylist.artwork}
                  alt="Now Playing"
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {currentPlaylist.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Playing {currentSongIndex + 1} of {currentPlaylist.songCount}
                  </p>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handlePreviousSong}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <SkipBack className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setPlayingId(null)}
                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    <Pause className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNextSong}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <SkipForward className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500">{formatTime(progress)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleProgressChange}
                    className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                  />
                  <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-1 justify-end">
                <button
                  onClick={toggleMute}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-600"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onSave={(playlistData) => {
            console.log('Creating playlist:', playlistData);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => {
          const audio = e.currentTarget;
          setProgress((audio.currentTime / audio.duration) * 100);
          setDuration(audio.duration);
        }}
      />
    </div>
  );
};

export default MediaLibrary;