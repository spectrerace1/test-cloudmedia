import React from 'react';
import { Music, Volume2, Wifi, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const activities = [
  {
    id: 1,
    type: 'playlist',
    message: 'Downtown Branch playlist changed to Summer Hits 2024',
    time: '2 minutes ago',
  },
  {
    id: 2,
    type: 'announcement',
    message: 'Store closing announcement played at Mall Location',
    time: '15 minutes ago',
  },
  {
    id: 3,
    type: 'status',
    message: 'Airport Store device went offline',
    time: '1 hour ago',
  },
  {
    id: 4,
    type: 'settings',
    message: 'Volume adjusted for Downtown Branch devices',
    time: '2 hours ago',
  }
];

const ActivityLog: React.FC = () => {
  const navigate = useNavigate();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'playlist':
        return <Music className="w-4 h-4" />;
      case 'announcement':
        return <Volume2 className="w-4 h-4" />;
      case 'status':
        return <Wifi className="w-4 h-4" />;
      case 'settings':
        return <Settings className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Last Activities</h2>
        <button 
          onClick={() => navigate('/activities')}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-center"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 break-words">{activity.message}</p>
              <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;