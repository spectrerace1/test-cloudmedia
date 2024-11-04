import React, { useState } from 'react';
import { X, Calendar, Clock, Building2, Users } from 'lucide-react';

interface Playlist {
  id: number;
  name: string;
  source: string;
  duration: string;
  tracks: number;
  status: 'active' | 'inactive';
  assignedTo: string[];
}

interface PlaylistSchedulerProps {
  playlist: Playlist;
  onClose: () => void;
}

const branches = [
  { id: 1, name: 'Downtown Branch' },
  { id: 2, name: 'Mall Location' },
  { id: 3, name: 'Airport Store' }
];

const groups = [
  { id: 1, name: 'City Center Branches' },
  { id: 2, name: 'Shopping Malls' },
  { id: 3, name: 'Airport Locations' }
];

const PlaylistScheduler: React.FC<PlaylistSchedulerProps> = ({ playlist, onClose }) => {
  const [scheduleType, setScheduleType] = useState<'branch' | 'group'>('branch');
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('22:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri']);

  const days = [
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' },
    { id: 'sun', label: 'Sun' }
  ];

  const toggleDay = (dayId: string) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const toggleBranch = (branchId: number) => {
    setSelectedBranches(prev =>
      prev.includes(branchId)
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    );
  };

  const toggleGroup = (groupId: number) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Schedule Playlist</h2>
            <p className="text-gray-600 mt-1">{playlist.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Type Selection */}
          <div className="flex gap-4">
            <button
              onClick={() => setScheduleType('branch')}
              className={`flex-1 p-4 rounded-lg border ${
                scheduleType === 'branch'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Building2 className={`w-6 h-6 mb-2 ${
                scheduleType === 'branch' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <h3 className="font-medium text-gray-900">Assign to Branches</h3>
              <p className="text-sm text-gray-600">Schedule for specific branches</p>
            </button>
            <button
              onClick={() => setScheduleType('group')}
              className={`flex-1 p-4 rounded-lg border ${
                scheduleType === 'group'
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Users className={`w-6 h-6 mb-2 ${
                scheduleType === 'group' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <h3 className="font-medium text-gray-900">Assign to Groups</h3>
              <p className="text-sm text-gray-600">Schedule for branch groups</p>
            </button>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days
            </label>
            <div className="flex gap-2">
              {days.map((day) => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    selectedDays.includes(day.id)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Branch/Group Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {scheduleType === 'branch' ? 'Select Branches' : 'Select Groups'}
            </label>
            <div className="space-y-2">
              {scheduleType === 'branch' ? (
                branches.map((branch) => (
                  <label
                    key={branch.id}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBranches.includes(branch.id)}
                      onChange={() => toggleBranch(branch.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3">{branch.name}</span>
                  </label>
                ))
              ) : (
                groups.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroup(group.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-3">{group.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistScheduler;