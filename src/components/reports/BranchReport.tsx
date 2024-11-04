import React from 'react';
import { Building2, Clock, Signal, Volume2, Music2 } from 'lucide-react';

interface BranchReportProps {
  dateRange: number;
}

const BranchReport: React.FC<BranchReportProps> = ({ dateRange }) => {
  const branchStats = [
    {
      name: 'Downtown Branch',
      uptime: '99.8%',
      deviceStatus: {
        total: 3,
        online: 3,
        offline: 0
      },
      playlistChanges: 12,
      announcements: 24
    },
    {
      name: 'Mall Location',
      uptime: '98.2%',
      deviceStatus: {
        total: 2,
        online: 1,
        offline: 1
      },
      playlistChanges: 8,
      announcements: 16
    },
    {
      name: 'Airport Store',
      uptime: '95.5%',
      deviceStatus: {
        total: 1,
        online: 1,
        offline: 0
      },
      playlistChanges: 6,
      announcements: 12
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">Branch Performance Report</h3>
        <p className="text-gray-600 mt-1">Last {dateRange} days statistics</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Uptime</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Device Status</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Playlist Changes</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Announcements</th>
            </tr>
          </thead>
          <tbody>
            {branchStats.map((branch, index) => (
              <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{branch.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{branch.uptime}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Signal className="w-4 h-4 text-gray-400" />
                    <span className="text-green-600">{branch.deviceStatus.online} online</span>
                    {branch.deviceStatus.offline > 0 && (
                      <span className="text-red-600">{branch.deviceStatus.offline} offline</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{branch.playlistChanges}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{branch.announcements}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BranchReport;