import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music2, Play, Pause } from 'lucide-react';
import { mockPlaylists } from './mockData';
import MediaLibraryLoader from './MediaLibraryLoader';

const MediaLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handlePlay = (e: React.MouseEvent, playlistId: number) => {
    e.stopPropagation(); // Prevent navigation when clicking play
    setPlayingId(playingId === playlistId ? null : playlistId);
  };

  if (isLoading) {
    return <MediaLibraryLoader />;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      {/* Featured Section */}
      <div className="bg-gradient-to-r from-red-700 to-red-800 rounded-2xl p-8 flex justify-between items-center">
        <div className="space-y-4 flex-1">
          <h2 className="text-2xl font-bold text-white">Chill Beats</h2>
          <p className="text-white/80 max-w-xl text-sm">
            Feel the groove with tracks like "Conquer the Storm," "My Side," and "Magic Ride." 
            Let the soothing beats take you on a journey through laid-back melodies and chill vibes, 
            perfect for any relaxing moment.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=150&h=150&fit=crop"
          alt="Chill Beats"
          className="w-24 h-24 rounded-lg object-cover ml-8"
        />
      </div>

      {/* Sections */}
      {['Cafe Channel', 'Popular today', 'Trending Playlists'].map((section, index) => (
        <div key={index} className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{section}</h3>
              <p className="text-sm text-gray-500">Time to get cozy</p>
            </div>
            {index === 0 && (
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockPlaylists.slice(0, 6).map((playlist) => (
              <div 
                key={playlist.id} 
                className="group cursor-pointer"
                onClick={() => navigate(`/media/playlist/${playlist.id}`)}
              >
                <div className="relative aspect-square mb-2">
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
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <h4 className="font-medium text-sm text-gray-900 truncate">{playlist.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{playlist.category}</span>
                  <span className="text-xs text-gray-900">•</span>
                  <span className="text-xs text-gray-500">{playlist.mood}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Player Bar */}
      {playingId && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={mockPlaylists.find(p => p.id === playingId)?.artwork}
                alt="Now Playing"
                className="w-12 h-12 rounded object-cover"
              />
              <div>
                <h4 className="font-medium text-gray-900">
                  {mockPlaylists.find(p => p.id === playingId)?.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {mockPlaylists.find(p => p.id === playingId)?.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPlayingId(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Pause className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;