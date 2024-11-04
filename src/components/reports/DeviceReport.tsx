import React from 'react';
import { Signal, SignalZero, Clock, AlertTriangle } from 'lucide-react';

interface DeviceReportProps {
  dateRange: number;
}

const DeviceReport: React.FC<DeviceReportProps> = ({ dateRange }) => {
  const deviceStats = [
    {
      id: 'ABC123',
      name: 'Main Display',
      branch: 'Downtown Branch',
      uptime: '99.8%',
      status: 'online',
      lastOffline: 'Never',
      incidents: 0
    },
    {
      id: 'DEF456',
      name: 'Window Display',
      branch: 'Mall Location',
      uptime: '95.2%',
      status: 'offline',
      lastOffline: '2 hours ago',
      incidents: 3
    },
    {
      id: 'GHI789',
      name: 'Entrance Screen',
      branch: 'Airport Store',
      uptime: '98.5%',
      status: 'online',
      lastOffline: '3 days ago',
      incidents: 1
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900">Device Status Report</h3>
        <p className="text-gray-600 mt-1">Last {dateRange} days device performance</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Device</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Uptime</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Last Offline</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Incidents</th>
            </tr>
          </thead>
          <tbody>
            {deviceStats.map((device) => (
              <tr key={device.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{device.name}</span>
                    <span className="text-sm text-gray-500">ID: {device.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-900">{device.branch}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{device.uptime}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {device.status === 'online' ? (
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
                <td className="px-6 py-4">
                  <span className="text-gray-600">{device.lastOffline}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      device.incidents > 0 ? 'text-yellow-500' : 'text-gray-400'
                    }`} />
                    <span className={`${
                      device.incidents > 0 ? 'text-yellow-500' : 'text-gray-600'
                    }`}>
                      {device.incidents} incidents
                    </span>
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

export default DeviceReport;