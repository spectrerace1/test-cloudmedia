import React from 'react';
import { X, Clock, Music2 } from 'lucide-react';
import { Playlist } from './types';

interface PlaylistDetailModalProps {
  playlist: Playlist;
  onClose: () => void;
}

// Mock songs data
const mockSongs = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  title: `Song Title ${i + 1}`,
  artist: `Artist ${Math.floor(i / 10) + 1}`,
  duration: `${Math.floor(Math.random() * 5 + 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
}));

const PlaylistDetailModal: React.FC<PlaylistDetailModalProps> = ({ playlist, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <img
              src={playlist.artwork}
              alt={playlist.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{playlist.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">{playlist.category}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">{playlist.mood}</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">{playlist.songCount} songs</span>
                <span className="text-sm text-gray-300">•</span>
                <span className="text-sm text-gray-500">{playlist.duration}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody>
              {mockSongs.map((song) => (
                <tr 
                  key={song.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{song.id}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Music2 className="w-4 h-4 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{song.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{song.artist}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
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
      </div>
    </div>
  );
};

export default PlaylistDetailModal;