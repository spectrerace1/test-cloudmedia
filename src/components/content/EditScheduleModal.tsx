import React, { useState } from 'react';
import { X, Search, Music2, Building2, Calendar, Clock, Users, Check } from 'lucide-react';

interface EditScheduleModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  onClose,
  onSave,
  initialData
}) => {
  // State management
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '18:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialData?.days || ['mon', 'tue', 'wed', 'thu', 'fri']
  );
  const [targetType, setTargetType] = useState<'branches' | 'groups'>('branches');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const playlists = [
    { id: 'p1', name: 'Summer Hits 2024', tracks: 25, duration: '2h 30m' },
    { id: 'p2', name: 'Relaxing Jazz', tracks: 18, duration: '1h 45m' },
    { id: 'p3', name: 'Pop Classics', tracks: 35, duration: '3h' }
  ];

  const branches = Array.from({ length: 200 }, (_, i) => ({
    id: `br-${i + 1}`,
    name: `Branch ${i + 1}`,
    location: `Location ${Math.floor(i / 20) + 1}`,
    status: Math.random() > 0.2 ? 'online' : 'offline'
  }));

  const groups = [
    { id: 'g1', name: 'City Center', branchCount: 45 },
    { id: 'g2', name: 'Shopping Malls', branchCount: 38 },
    { id: 'g3', name: 'Airport Locations', branchCount: 22 }
  ];

  const days = [
    { id: 'mon', label: 'M' },
    { id: 'tue', label: 'T' },
    { id: 'wed', label: 'W' },
    { id: 'thu', label: 'T' },
    { id: 'fri', label: 'F' },
    { id: 'sat', label: 'S' },
    { id: 'sun', label: 'S' }
  ];

  // Handlers
  const handleSelectAll = () => {
    if (targetType === 'branches') {
      const filtered = filteredItems() as typeof branches;
      setSelectedBranches(prev => 
        prev.length === filtered.length ? [] : filtered.map(b => b.id)
      );
    } else {
      const filtered = filteredItems() as typeof groups;
      setSelectedGroups(prev =>
        prev.length === filtered.length ? [] : filtered.map(g => g.id)
      );
    }
  };

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    return targetType === 'branches'
      ? branches.filter(branch => 
          branch.name.toLowerCase().includes(term) ||
          branch.location.toLowerCase().includes(term)
        )
      : groups.filter(group =>
          group.name.toLowerCase().includes(term)
        );
  };

  const handleSubmit = () => {
    onSave({
      playlist: selectedPlaylist,
      schedule: {
        startDate,
        endDate,
        startTime,
        endTime,
        days: selectedDays
      },
      targets: {
        type: targetType,
        items: targetType === 'branches' ? selectedBranches : selectedGroups
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Edit Schedule</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-12 gap-6 p-6 max-h-[calc(100vh-200px)] overflow-y-auto modal-scroll">
          {/* Left Column - Playlist Selection */}
          <div className="col-span-3 space-y-4">
            <h3 className="font-medium text-gray-900">Select Playlist</h3>
            <div className="space-y-2">
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPlaylist === playlist.id
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Music2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{playlist.name}</div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {playlist.tracks} tracks • {playlist.duration}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - Branch/Group Selection */}
          <div className="col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Select Target</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTargetType('branches')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    targetType === 'branches'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Branches
                </button>
                <button
                  onClick={() => setTargetType('groups')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    targetType === 'groups'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Groups
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${targetType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                {targetType === 'branches'
                  ? selectedBranches.length === filteredItems().length
                    ? 'Deselect All'
                    : 'Select All'
                  : selectedGroups.length === filteredItems().length
                    ? 'Deselect All'
                    : 'Select All'
                }
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg">
              <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
                {targetType === 'branches'
                  ? (filteredItems() as typeof branches).map(branch => (
                      <label
                        key={branch.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                          selectedBranches.includes(branch.id)
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(branch.id)}
                          onChange={() => {
                            setSelectedBranches(prev =>
                              prev.includes(branch.id)
                                ? prev.filter(id => id !== branch.id)
                                : [...prev, branch.id]
                            );
                          }}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{branch.name}</span>
                            </div>
                            {selectedBranches.includes(branch.id) && (
                              <Check className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <div className="mt-1 ml-6 flex items-center gap-2 text-sm">
                            <span className="text-gray-500">{branch.location}</span>
                            <span className="text-gray-300">•</span>
                            <span className={branch.status === 'online' ? 'text-green-600' : 'text-red-600'}>
                              {branch.status}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))
                  : (filteredItems() as typeof groups).map(group => (
                      <label
                        key={group.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                          selectedGroups.includes(group.id)
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedGroups.includes(group.id)}
                          onChange={() => {
                            setSelectedGroups(prev =>
                              prev.includes(group.id)
                                ? prev.filter(id => id !== group.id)
                                : [...prev, group.id]
                            );
                          }}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">{group.name}</span>
                            </div>
                            {selectedGroups.includes(group.id) && (
                              <Check className="w-4 h-4 text-indigo-600" />
                            )}
                          </div>
                          <div className="mt-1 ml-6 text-sm text-gray-500">
                            {group.branchCount} branches
                          </div>
                        </div>
                      </label>
                    ))
                }
              </div>
            </div>
          </div>

          {/* Right Column - Schedule Settings */}
          <div className="col-span-4 space-y-6">
            <h3 className="font-medium text-gray-900">Set Schedule</h3>
            
            {/* Date Range */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="--/--/----"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="--/--/----"
                  />
                </div>
              </div>
            </div>

            {/* Time Range */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="--:--"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="--:--"
                  />
                </div>
              </div>
            </div>

            {/* Days Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Working Days</label>
              <div className="flex gap-2">
                {days.map(day => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      setSelectedDays(prev =>
                        prev.includes(day.id)
                          ? prev.filter(d => d !== day.id)
                          : [...prev, day.id]
                      );
                    }}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      selectedDays.includes(day.id)
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Helper Text */}
            {(!startDate || !endDate || !startTime || !endTime) && (
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-sm text-indigo-600">
                  * Leave empty for indefinite schedule
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {targetType === 'branches'
              ? `${selectedBranches.length} branches selected`
              : `${selectedGroups.length} groups selected`
            }
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedPlaylist || (targetType === 'branches' ? !selectedBranches.length : !selectedGroups.length)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditScheduleModal;