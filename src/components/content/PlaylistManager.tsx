import React, { useState } from 'react';
import { Music2, Calendar, Clock, Edit, Trash2, Building2 } from 'lucide-react';
import CreateScheduleModal from './CreateScheduleModal';

interface Schedule {
  id: number;
  playlist: string;
  branches: number;
  startDate: string;
  endDate: string;
  timeRange: string;
  status: 'pending' | 'playing' | 'completed';
}

const PlaylistManager: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const schedules: Schedule[] = [
    {
      id: 1,
      playlist: 'Relaxing Jazz',
      branches: 1,
      startDate: '2024-11-02',
      endDate: '2024-12-02',
      timeRange: '09:00 - 18:00',
      status: 'pending'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Playlist Schedules</h2>
            <p className="text-gray-600 mt-1">Manage your playlist schedules across branches</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Schedule
          </button>
        </div>
      </div>

      {/* Schedules Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Playlist</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Branches</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Schedule</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="text-right px-6 py-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Music2 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-900">{schedule.playlist}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {schedule.branches} branches
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {schedule.startDate} - {schedule.endDate}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {schedule.timeRange}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    schedule.status === 'playing'
                      ? 'bg-green-100 text-green-800'
                      : schedule.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => {
                        setEditingSchedule(schedule);
                        setShowCreateModal(true);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CreateScheduleModal
          onClose={() => {
            setShowCreateModal(false);
            setEditingSchedule(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingSchedule(null);
          }}
          editingSchedule={editingSchedule}
        />
      )}
    </div>
  );
};

export default PlaylistManager;