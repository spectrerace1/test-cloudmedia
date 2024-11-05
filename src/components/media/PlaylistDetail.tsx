import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Music2, Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import PushPlaylistModal from './PushPlaylistModal';
import PlaylistDetailLoader from './PlaylistDetailLoader';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

interface Playlist {
  id: number;
  name: string;
  category: string;
  mood: string;
  artwork: string;
  songCount: number;
  duration: string;
  songs: Song[];
}

// Mock playlists data
const mockPlaylists: Playlist[] = [
  {
    id: 1,
    name: "Summer Vibes 2024",
    category: "Pop",
    mood: "Energetic",
    artwork: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGolMjBtdXNpY3xlbnwwfHwwfHx8MA%3D%3D",
    songCount: 45,
    duration: "2h 45m",
    songs: Array.from({ length: 45 }, (_, i) => ({
      id: i + 1,
      title: `Song Title ${i + 1}`,
      artist: `Artist ${Math.floor(i / 5) + 1}`,
      duration: `${Math.floor(Math.random() * 4) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    }))
  },
  // ... other playlists
];

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [showPushModal, setShowPushModal] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const playlist = mockPlaylists.find(p => p.id === Number(id));
      if (playlist) {
        setCurrentPlaylist(playlist);
      }
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [id]);

  const handlePlaylistPlay = () => {
    setIsPlaylistPlaying(!isPlaylistPlaying);
    if (currentSongIndex === null) {
      setCurrentSongIndex(0);
    }
  };

  const handleSongPlay = (index: number) => {
    if (currentSongIndex === index) {
      setCurrentSongIndex(null);
      setIsPlaylistPlaying(false);
    } else {
      setCurrentSongIndex(index);
      setIsPlaylistPlaying(true);
    }
  };

  const handleNextSong = () => {
    if (currentPlaylist && currentSongIndex !== null) {
      const nextIndex = (currentSongIndex + 1) % currentPlaylist.songs.length;
      setCurrentSongIndex(nextIndex);
    }
  };

  const handlePreviousSong = () => {
    if (currentPlaylist && currentSongIndex !== null) {
      const prevIndex = currentSongIndex === 0 ? currentPlaylist.songs.length - 1 : currentSongIndex - 1;
      setCurrentSongIndex(prevIndex);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <PlaylistDetailLoader />;
  }

  if (!currentPlaylist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <Music2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Playlist Not Found</h2>
          <p className="text-gray-600 mb-6">The playlist you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/media')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Media Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <button
          onClick={() => navigate('/media')}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back to Media Library</span>
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={currentPlaylist.artwork}
                alt={currentPlaylist.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <button
                  onClick={handlePlaylistPlay}
                  className="p-3 bg-white rounded-full hover:scale-105 transition-transform"
                >
                  {isPlaylistPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentPlaylist.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">{currentPlaylist.category}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">{currentPlaylist.mood}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">{currentPlaylist.songCount} songs</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">{currentPlaylist.duration}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowPushModal(true)}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Push
          </button>
        </div>
      </div>

      {/* Song List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
              <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody>
            {currentPlaylist.songs.map((song, index) => (
              <tr
                key={song.id}
                onClick={() => handleSongPlay(index)}
                className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer ${
                  currentSongIndex === index ? 'bg-indigo-50' : ''
                }`}
              >
                <td className="py-4 px-6 text-gray-900">{index + 1}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <Music2 className="w-4 h-4 text-gray-400 mr-3" />
                    <span className={`font-medium ${currentSongIndex === index ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {song.title}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-500">{song.artist}</td>
                <td className="py-4 px-6 text-gray-500 text-right">
                  <div className="flex items-center justify-end">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    {song.duration}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Audio Player */}
      {currentSongIndex !== null && (
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
                    {currentPlaylist.songs[currentSongIndex].title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {currentPlaylist.songs[currentSongIndex].artist}
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
                    onClick={() => setIsPlaylistPlaying(!isPlaylistPlaying)}
                    className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                  >
                    {isPlaylistPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
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

      {/* Push Modal */}
      <PushPlaylistModal
        isOpen={showPushModal}
        onClose={() => setShowPushModal(false)}
        playlistName={currentPlaylist.name}
        onPush={(targets) => {
          console.log('Pushing playlist to:', targets);
          alert('Playlist pushed successfully!');
        }}
      />
    </div>
  );
};

export default PlaylistDetail;