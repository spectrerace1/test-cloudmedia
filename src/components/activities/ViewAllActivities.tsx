import React, { useState } from 'react';
import { 
  Music, 
  Volume2, 
  Wifi, 
  Settings, 
  Calendar, 
  Search, 
  Filter, 
  SortAsc, 
  Building2, 
  Clock,
  Download,
  FileText,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';

interface Activity {
  id: number;
  type: 'playlist' | 'announcement' | 'status' | 'settings';
  message: string;
  branch: string;
  time: string;
  details?: string;
  severity?: 'info' | 'warning' | 'error';
  user?: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'playlist',
    message: 'Playlist changed to Summer Hits 2024',
    branch: 'Downtown Branch',
    time: '2 minutes ago',
    details: 'Changed by System Admin',
    severity: 'info',
    user: 'John Doe'
  },
  {
    id: 2,
    type: 'announcement',
    message: 'Store closing announcement played',
    branch: 'Mall Location',
    time: '15 minutes ago',
    details: 'Duration: 30 seconds',
    severity: 'info',
    user: 'Jane Smith'
  },
  {
    id: 3,
    type: 'status',
    message: 'Device went offline',
    branch: 'Airport Store',
    time: '1 hour ago',
    details: 'Device ID: ABC123',
    severity: 'error',
    user: 'System'
  },
  {
    id: 4,
    type: 'settings',
    message: 'Volume adjusted for all devices',
    branch: 'Downtown Branch',
    time: '2 hours ago',
    details: 'Changed from 75% to 80%',
    severity: 'info',
    user: 'John Doe'
  },
  {
    id: 5,
    type: 'playlist',
    message: 'Playlist schedule updated',
    branch: 'Mall Location',
    time: '3 hours ago',
    details: 'New schedule: 9:00 AM - 10:00 PM',
    severity: 'info',
    user: 'Jane Smith'
  },
  {
    id: 6,
    type: 'announcement',
    message: 'New announcement uploaded',
    branch: 'All Branches',
    time: '4 hours ago',
    details: 'Special Promotion.mp3',
    severity: 'info',
    user: 'John Doe'
  }
];

const ViewAllActivities: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'playlist' | 'announcement' | 'status' | 'settings'>('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'error'>('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const getActivityColor = (severity: string) => {
    switch (severity) {
      case 'info':
        return 'bg-blue-50 text-blue-600';
      case 'warning':
        return 'bg-yellow-50 text-yellow-600';
      case 'error':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || activity.severity === severityFilter;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const ActivityStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Activities</p>
            <p className="text-xl font-semibold text-gray-900">{activities.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <Music className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Playlist Changes</p>
            <p className="text-xl font-semibold text-gray-900">
              {activities.filter(a => a.type === 'playlist').length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Volume2 className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Announcements</p>
            <p className="text-xl font-semibold text-gray-900">
              {activities.filter(a => a.type === 'announcement').length}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">System Alerts</p>
            <p className="text-xl font-semibold text-gray-900">
              {activities.filter(a => a.severity === 'error').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity History</h2>
          <p className="text-gray-600 mt-1">Track and monitor all system activities</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Download className="w-4 h-4 mr-2" />
            Download CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <ActivityStats />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 text-gray-500 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="playlist">Playlists</option>
                    <option value="announcement">Announcements</option>
                    <option value="status">Status Changes</option>
                    <option value="settings">Settings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Severities</option>
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="severity">Severity</option>
                    <option value="type">Type</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activities List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Activity</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">User</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Time</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.severity || 'info')}`}>
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
                    <span className="text-gray-900">{activity.user}</span>
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

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredActivities.length} of {activities.length} activities
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
              Previous
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllActivities;