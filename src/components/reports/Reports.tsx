import React, { useState } from 'react';
import { BarChart3, Calendar } from 'lucide-react';
import BranchReport from './BranchReport';
import DeviceReport from './DeviceReport';
import PlaylistReport from './PlaylistReport';
import AnnouncementReport from './AnnouncementReport';

const Reports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'branch' | 'device' | 'playlist' | 'announcement'>('branch');
  const [dateRange, setDateRange] = useState('7');

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveReport('branch')}
            className={`p-4 rounded-lg border ${
              activeReport === 'branch'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className={`w-6 h-6 mb-2 ${
              activeReport === 'branch' ? 'text-indigo-600' : 'text-gray-400'
            }`} />
            <h3 className="font-medium text-gray-900">Branch Report</h3>
            <p className="text-sm text-gray-600">View branch performance</p>
          </button>

          <button
            onClick={() => setActiveReport('device')}
            className={`p-4 rounded-lg border ${
              activeReport === 'device'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className={`w-6 h-6 mb-2 ${
              activeReport === 'device' ? 'text-indigo-600' : 'text-gray-400'
            }`} />
            <h3 className="font-medium text-gray-900">Device Report</h3>
            <p className="text-sm text-gray-600">View device status</p>
          </button>

          <button
            onClick={() => setActiveReport('playlist')}
            className={`p-4 rounded-lg border ${
              activeReport === 'playlist'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className={`w-6 h-6 mb-2 ${
              activeReport === 'playlist' ? 'text-indigo-600' : 'text-gray-400'
            }`} />
            <h3 className="font-medium text-gray-900">Playlist Report</h3>
            <p className="text-sm text-gray-600">View playlist history</p>
          </button>

          <button
            onClick={() => setActiveReport('announcement')}
            className={`p-4 rounded-lg border ${
              activeReport === 'announcement'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className={`w-6 h-6 mb-2 ${
              activeReport === 'announcement' ? 'text-indigo-600' : 'text-gray-400'
            }`} />
            <h3 className="font-medium text-gray-900">Announcement Report</h3>
            <p className="text-sm text-gray-600">View announcement history</p>
          </button>
        </div>
      </div>

      {/* Date Range Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Date Range</h3>
            <p className="text-gray-600">Select the time period for the report</p>
          </div>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      {/* Report Content */}
      <div>
        {activeReport === 'branch' && <BranchReport dateRange={parseInt(dateRange)} />}
        {activeReport === 'device' && <DeviceReport dateRange={parseInt(dateRange)} />}
        {activeReport === 'playlist' && <PlaylistReport dateRange={parseInt(dateRange)} />}
        {activeReport === 'announcement' && <AnnouncementReport dateRange={parseInt(dateRange)} />}
      </div>
    </div>
  );
};

export default Reports;