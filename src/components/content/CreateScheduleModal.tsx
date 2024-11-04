import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Clock, Music2, CheckCircle } from 'lucide-react';

interface CreateScheduleModalProps {
  onClose: () => void;
  onSave: (scheduleData: any) => void;
  editingSchedule?: any;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({ onClose, onSave, editingSchedule }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '18:00',
    days: ['mon', 'tue', 'wed', 'thu', 'fri']
  });

  useEffect(() => {
    if (editingSchedule) {
      // Pre-fill form with editing schedule data
      const [startTime, endTime] = editingSchedule.timeRange.split(' - ');
      setScheduleData({
        startDate: editingSchedule.startDate,
        endDate: editingSchedule.endDate,
        startTime,
        endTime,
        days: ['mon', 'tue', 'wed', 'thu', 'fri'] // You might want to store this in your schedule data
      });
      // Set other fields based on your data structure
      setSelectedPlaylist(1); // Set to actual playlist ID
      setSelectedBranches([1]); // Set to actual branch IDs
    }
  }, [editingSchedule]);

  // Sample data
  const playlists = [
    { id: 1, name: 'Summer Hits 2024', duration: '2h 30m', tracks: 25 },
    { id: 2, name: 'Relaxing Jazz', duration: '1h 45m', tracks: 18 },
    { id: 3, name: 'Pop Classics', duration: '3h', tracks: 35 }
  ];

  const branches = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    name: `Branch ${i + 1}`,
    location: `Location ${i + 1}`,
    status: Math.random() > 0.2 ? 'online' : 'offline'
  }));

  const days = [
    { id: 'mon', label: 'M' },
    { id: 'tue', label: 'T' },
    { id: 'wed', label: 'W' },
    { id: 'thu', label: 'T' },
    { id: 'fri', label: 'F' },
    { id: 'sat', label: 'S' },
    { id: 'sun', label: 'S' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      playlist: playlists.find(p => p.id === selectedPlaylist)?.name,
      branches: selectedBranches,
      schedule: scheduleData
    });
  };

  const filteredBranches = branches.filter(branch => 
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBranches([]);
    } else {
      setSelectedBranches(filteredBranches.map(b => b.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingSchedule ? 'Edit Schedule' : 'Create Schedule'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Playlist Selection */}
              <div className="col-span-3 border-r border-gray-200 pr-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Select Playlist</h3>
                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <label
                      key={playlist.id}
                      className={`flex items-center p-3 rounded-lg border ${
                        selectedPlaylist === playlist.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      } cursor-pointer`}
                    >
                      <input
                        type="radio"
                        name="playlist"
                        className="sr-only"
                        checked={selectedPlaylist === playlist.id}
                        onChange={() => setSelectedPlaylist(playlist.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{playlist.name}</span>
                          {selectedPlaylist === playlist.id && (
                            <CheckCircle className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Music2 className="w-4 h-4 mr-1" />
                          <span>{playlist.tracks} tracks</span>
                          <span className="mx-2">•</span>
                          <span>{playlist.duration}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Middle Column - Branch Selection */}
              <div className="col-span-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Select Branches</h3>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {selectAll ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search branches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {filteredBranches.map((branch) => (
                      <label
                        key={branch.id}
                        className={`flex items-center p-2 rounded border ${
                          selectedBranches.includes(branch.id)
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        } cursor-pointer`}
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                          <div className="text-xs text-gray-500">{branch.location}</div>
                        </div>
                        <div className={`ml-auto text-xs ${
                          branch.status === 'online' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {branch.status}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Schedule Settings */}
              <div className="col-span-3 border-l border-gray-200 pl-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Set Schedule</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={scheduleData.startDate}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={scheduleData.endDate}
                      onChange={(e) => setScheduleData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={scheduleData.startTime}
                        onChange={(e) => setScheduleData(prev => ({ ...prev, startTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={scheduleData.endTime}
                        onChange={(e) => setScheduleData(prev => ({ ...prev, endTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                    <div className="flex gap-1">
                      {days.map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          onClick={() => {
                            setScheduleData(prev => ({
                              ...prev,
                              days: prev.days.includes(day.id)
                                ? prev.days.filter(d => d !== day.id)
                                : [...prev.days, day.id]
                            }));
                          }}
                          className={`w-8 h-8 rounded-full text-sm font-medium ${
                            scheduleData.days.includes(day.id)
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-b-xl flex justify-between">
            <div className="flex items-center text-sm text-gray-600">
              {selectedBranches.length} branches selected
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedPlaylist || selectedBranches.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingSchedule ? 'Save Changes' : 'Create Schedule'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;