import React from 'react';
import { ChevronDown, ChevronUp, Music2, Building2, Clock } from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistTableProps {
  playlists: Playlist[];
  expandedPlaylist: number | null;
  setExpandedPlaylist: (id: number | null) => void;
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({
  playlists,
  expandedPlaylist,
  setExpandedPlaylist
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
            <th className="text-left px-6 py-4 text-gray-600 font-medium">Playlist</th>
            <th className="text-left px-6 py-4 text-gray-600 font-medium">Category</th>
            <th className="text-left px-6 py-4 text-gray-600 font-medium">Created By</th>
            <th className="text-left px-6 py-4 text-gray-600 font-medium">Assigned Date</th>
            <th className="text-right px-6 py-4 text-gray-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {playlists.map((playlist) => (
            <React.Fragment key={playlist.id}>
              <tr className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{playlist.branch.name}</p>
                      <p className="text-sm text-gray-500">ID: {playlist.branch.branchId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-indigo-600" />
                    <span className="text-gray-900">{playlist.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-900">{playlist.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-900">{playlist.createdBy}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{playlist.assignedDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setExpandedPlaylist(expandedPlaylist === playlist.id ? null : playlist.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    {expandedPlaylist === playlist.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </td>
              </tr>
              {expandedPlaylist === playlist.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-2">
                      {playlist.songs.map((song, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Music2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{song.name}</p>
                              <p className="text-sm text-gray-500">{song.artist}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">{song.duration}</span>
                            <span className="text-sm text-gray-500">Played: {song.playCount}</span>
                            <span className="text-sm text-gray-500">Last: {song.lastPlayed}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistTable;