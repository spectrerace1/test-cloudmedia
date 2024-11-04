import React from 'react';
import { Signal, SignalZero, Play, Pause, Volume2 } from 'lucide-react';

interface BranchStatusProps {
  onViewAll: () => void;
}

const branches = [
  {
    id: 1,
    name: 'Downtown Branch',
    devices: 3,
    playlist: 'Summer Hits 2024',
    status: 'online',
    hasAnnouncement: true
  },
  {
    id: 2,
    name: 'Mall Location',
    devices: 2,
    playlist: 'Relaxing Jazz',
    status: 'online',
    hasAnnouncement: false
  },
  {
    id: 3,
    name: 'Airport Store',
    devices: 1,
    playlist: 'Pop Classics',
    status: 'offline',
    hasAnnouncement: false
  },
];

const BranchStatus: React.FC<BranchStatusProps> = ({ onViewAll }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Branch Status</h2>
        <button 
          onClick={onViewAll}
          className="w-full sm:w-auto px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-center"
        >
          View All Branches
        </button>
      </div>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">Branch</th>
                <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">Devices</th>
                <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">Current Playlist</th>
                <th className="text-left py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">Status</th>
                <th className="text-right py-4 px-4 sm:px-6 text-xs sm:text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-medium text-gray-900">{branch.name}</span>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-gray-600">{branch.devices} devices</td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-green-600" />
                      <span className="text-gray-900 truncate">{branch.playlist}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-2">
                      {branch.status === 'online' ? (
                        <>
                          <Signal className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">Online</span>
                        </>
                      ) : (
                        <>
                          <SignalZero className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Offline</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center justify-end gap-2">
                      {branch.hasAnnouncement && (
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600">
                        {branch.status === 'online' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
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

export default BranchStatus;