import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Music2, Play, Pause } from 'lucide-react';
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

// Expanded mock playlists data
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
  {
    id: 2,
    name: "Relaxing Jazz",
    category: "Jazz",
    mood: "Calm",
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    songCount: 32,
    duration: "1h 55m",
    songs: Array.from({ length: 32 }, (_, i) => ({
      id: i + 1,
      title: `Jazz Standard ${i + 1}`,
      artist: `Jazz Artist ${Math.floor(i / 4) + 1}`,
      duration: `${Math.floor(Math.random() * 4) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    }))
  },
  {
    id: 3,
    name: "Coffee Shop Ambience",
    category: "Ambient",
    mood: "Relaxed",
    artwork: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    songCount: 28,
    duration: "1h 40m",
    songs: Array.from({ length: 28 }, (_, i) => ({
      id: i + 1,
      title: `Ambient Track ${i + 1}`,
      artist: `Ambient Artist ${Math.floor(i / 3) + 1}`,
      duration: `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    }))
  },
  {
    id: 4,
    name: "Shopping Mall Hits",
    category: "Pop",
    mood: "Upbeat",
    artwork: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    songCount: 52,
    duration: "3h 15m",
    songs: Array.from({ length: 52 }, (_, i) => ({
      id: i + 1,
      title: `Pop Hit ${i + 1}`,
      artist: `Pop Artist ${Math.floor(i / 6) + 1}`,
      duration: `${Math.floor(Math.random() * 4) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    }))
  },
  {
    id: 5,
    name: "Dinner Time Classics",
    category: "Classical",
    mood: "Elegant",
    artwork: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    songCount: 35,
    duration: "2h 10m",
    songs: Array.from({ length: 35 }, (_, i) => ({
      id: i + 1,
      title: `Classical Piece ${i + 1}`,
      artist: `Classical Artist ${Math.floor(i / 4) + 1}`,
      duration: `${Math.floor(Math.random() * 6) + 3}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    }))
  }
];

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaylistPlaying, setIsPlaylistPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);
  const [showPushModal, setShowPushModal] = useState(false);

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
  };

  const handleSongPlay = (index: number) => {
    if (currentSongIndex === index) {
      setCurrentSongIndex(null);
    } else {
      setCurrentSongIndex(index);
    }
  };

  const handlePushPlaylist = (targets: { type: 'branch' | 'group'; id: string }[]) => {
    console.log('Pushing playlist to:', targets);
    // Here you would implement the actual push logic
    alert('Playlist pushed successfully!');
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
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer"
              >
                <td className="py-4 px-6 text-gray-900">{index + 1}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <Music2 className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="font-medium text-gray-900">{song.title}</span>
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

      {/* Push Modal */}
      <PushPlaylistModal
        isOpen={showPushModal}
        onClose={() => setShowPushModal(false)}
        playlistName={currentPlaylist.name}
        onPush={handlePushPlaylist}
      />
    </div>
  );
};

export default PlaylistDetail;