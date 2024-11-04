import React from 'react';
import { Volume2, Calendar, Clock, Building2, CheckCircle2, XCircle } from 'lucide-react';

interface AnnouncementReportProps {
  dateRange: number;
}

const AnnouncementReport: React.FC<AnnouncementReportProps> = ({ dateRange }) => {
  const announcementHistory = [
    {
      id: 1,
      name: 'Store Closing Notice',
      branch: 'Downtown Branch',
      playDate: '2024-03-01 21:45',
      duration: '0:30',
      status: 'completed',
      playCount: 1
    },
    {
      id: 2,
      name: 'Special Promotion',
      branch: 'Mall Location',
      playDate: '2024-02-28 14:30',
      duration: '0:45',
      status: 'failed',
      playCount: 0
    },
    {
      id: 3,
      name: 'Holiday Hours',
      branch: 'Airport Store',
      playDate: '2024-02-27 10:00',
      duration: '1:00',
      status: 'completed',
      playCount: 3
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">Announcement History Report</h3>
        <p className="text-gray-600 mt-1">Last {dateRange} days announcement activity</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Announcement</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Play Date</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Duration</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Play Count</th>
            </tr>
          </thead>
          <tbody>
            {announcementHistory.map((announcement) => (
              <tr key={announcement.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-gray-900">{announcement.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{announcement.branch}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{announcement.playDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{announcement.duration}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {announcement.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Completed</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Failed</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {announcement.playCount} times
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnouncementReport;