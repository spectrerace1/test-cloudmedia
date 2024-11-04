import React, { useState } from 'react';
import { Music, Volume2, Wifi, Settings, Calendar, Search, Filter, SortAsc, Building2, Clock } from 'lucide-react';

interface Activity {
  id: number;
  type: 'playlist' | 'announcement' | 'status' | 'settings';
  message: string;
  branch: string;
  time: string;
  details?: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'playlist',
    message: 'Playlist changed to Summer Hits 2024',
    branch: 'Downtown Branch',
    time: '2 minutes ago',
    details: 'Changed by System Admin'
  },
  {
    id: 2,
    type: 'announcement',
    message: 'Store closing announcement played',
    branch: 'Mall Location',
    time: '15 minutes ago',
    details: 'Duration: 30 seconds'
  },
  {
    id: 3,
    type: 'status',
    message: 'Device went offline',
    branch: 'Airport Store',
    time: '1 hour ago',
    details: 'Device ID: ABC123'
  },
  {
    id: 4,
    type: 'settings',
    message: 'Volume adjusted for all devices',
    branch: 'Downtown Branch',
    time: '2 hours ago',
    details: 'Changed from 75% to 80%'
  },
  {
    id: 5,
    type: 'playlist',
    message: 'Playlist schedule updated',
    branch: 'Mall Location',
    time: '3 hours ago',
    details: 'New schedule: 9:00 AM - 10:00 PM'
  },
  {
    id: 6,
    type: 'announcement',
    message: 'New announcement uploaded',
    branch: 'All Branches',
    time: '4 hours ago',
    details: 'Special Promotion.mp3'
  }
];

const ViewAllActivities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'playlist' | 'announcement' | 'status' | 'settings'>('all');
  const [dateFilter, setDateFilter] = useState('all');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'playlist':
        return <Music className="w-5 h-5" />;
      case 'announcement':
        return <Volume2 className="w-5 h-5" />;
      case 'status':
        return <Wifi className="w-5 h-5" />;
      case 'settings':
        return <Settings className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'playlist':
        return 'bg-blue-50 text-blue-600';
      case 'announcement':
        return 'bg-yellow-50 text-yellow-600';
      case 'status':
        return 'bg-red-50 text-red-600';
      case 'settings':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity History</h2>
          <p className="text-gray-600 mt-1">View all system activities and events</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              Filters
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <SortAsc className="w-4 h-4 mr-2 text-gray-500" />
              Sort
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              typeFilter === 'all'
                ? 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Activities
          </button>
          <button
            onClick={() => setTypeFilter('playlist')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              typeFilter === 'playlist'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setTypeFilter('announcement')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              typeFilter === 'announcement'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setTypeFilter('status')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              typeFilter === 'status'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Status Changes
          </button>
          <button
            onClick={() => setTypeFilter('settings')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              typeFilter === 'settings'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Activity</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Time</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{activity.message}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{activity.branch}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{activity.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{activity.details}</span>
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

export default ViewAllActivities;