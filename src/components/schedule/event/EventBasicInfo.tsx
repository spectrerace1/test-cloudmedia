import React, { useState, useEffect } from 'react';
import { Music2, Search } from 'lucide-react';
import { EventFormData, ValidationError } from '../types';

interface EventBasicInfoProps {
  formData: EventFormData;
  onChange: (data: Partial<EventFormData>) => void;
  errors: ValidationError[];
}

// Mock playlists data - In real app, this would come from an API
const allPlaylists = Array.from({ length: 100 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Playlist ${i + 1}${i % 5 === 0 ? ' - Popular' : ''}${i % 3 === 0 ? ' - New' : ''}`,
  duration: `${Math.floor(Math.random() * 3 + 1)}h ${Math.floor(Math.random() * 60)}m`,
  tracks: Math.floor(Math.random() * 50 + 10),
  category: ['Pop', 'Jazz', 'Classical', 'Rock', 'Electronic'][Math.floor(Math.random() * 5)]
}));

const EventBasicInfo: React.FC<EventBasicInfoProps> = ({ formData, onChange, errors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedPlaylists, setDisplayedPlaylists] = useState<typeof allPlaylists>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    if (isSearchFocused) {
      const filtered = searchTerm
        ? allPlaylists.filter(playlist =>
            playlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            playlist.category.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : allPlaylists;
      setDisplayedPlaylists(filtered.slice(0, 10));
    } else {
      setDisplayedPlaylists([]);
    }
  }, [searchTerm, isSearchFocused]);

  // Show selected playlist even when search is not focused
  const selectedPlaylist = formData.playlist ? allPlaylists.find(p => p.id === formData.playlist) : null;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
            errors.some(error => error.field === 'title')
              ? 'border-red-300'
              : 'border-gray-300'
          }`}
          placeholder="Enter event title"
        />
      </div>

      {/* Playlist Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Playlist
        </label>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              // Small delay to allow click events on playlist items
              setTimeout(() => setIsSearchFocused(false), 200);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Selected Playlist (always visible) */}
        {selectedPlaylist && !isSearchFocused && !searchTerm && (
          <div className="mb-4">
            <label
              className="flex items-center p-3 rounded-lg border border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Music2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{selectedPlaylist.name}</div>
                  <div className="text-sm text-gray-500">
                    {selectedPlaylist.tracks} tracks • {selectedPlaylist.duration} • {selectedPlaylist.category}
                  </div>
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Playlist List */}
        {isSearchFocused && (
          <div className="space-y-2 max-h-64 overflow-y-auto elegant-scrollbar bg-white border border-gray-200 rounded-lg shadow-lg">
            {displayedPlaylists.map((playlist) => (
              <label
                key={playlist.id}
                className={`flex items-center p-3 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors ${
                  formData.playlist === playlist.id
                    ? 'bg-indigo-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="playlist"
                  value={playlist.id}
                  checked={formData.playlist === playlist.id}
                  onChange={(e) => {
                    onChange({ playlist: e.target.value });
                    setSearchTerm('');
                    setIsSearchFocused(false);
                  }}
                  className="sr-only"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <Music2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{playlist.name}</div>
                    <div className="text-sm text-gray-500">
                      {playlist.tracks} tracks • {playlist.duration} • {playlist.category}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Date and Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.some(error => error.field === 'date')
                ? 'border-red-300'
                : 'border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => onChange({ startTime: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.some(error => error.field === 'time')
                ? 'border-red-300'
                : 'border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.some(error => error.field === 'date')
                ? 'border-red-300'
                : 'border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => onChange({ endTime: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
              errors.some(error => error.field === 'time')
                ? 'border-red-300'
                : 'border-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default EventBasicInfo;