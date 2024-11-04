import React, { useState } from 'react';
import { X, Calendar, Clock, Building2, Users, Music2 } from 'lucide-react';

interface AnnouncementSchedulerProps {
  files: File[];
  onClose: () => void;
}

const AnnouncementScheduler: React.FC<AnnouncementSchedulerProps> = ({ files, onClose }) => {
  const [scheduleType, setScheduleType] = useState<'branch' | 'group'>('branch');
  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [repeat, setRepeat] = useState<'once' | 'daily' | 'weekly'>('once');
  const [interval, setInterval] = useState(5); // Minutes between announcements

  // Preview section for uploaded files
  const FilePreview = ({ file, index }: { file: File, index: number }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Music2 className="w-5 h-5 text-indigo-600" />
        <div>
          <p className="font-medium text-gray-900">{file.name}</p>
          <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          placeholder="Play order"
          className="w-16 px-2 py-1 border border-gray-300 rounded"
          // Add order handling logic here
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Schedule Announcements</h2>
              <p className="text-gray-600 mt-1">{files.length} files selected</p>
            </div>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* File Preview Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Selected Announcements</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file, index) => (
                <FilePreview key={index} file={file} index={index} />
              ))}
            </div>
          </div>

          {/* Interval Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interval Between Announcements
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <span className="text-gray-600">minutes</span>
            </div>
          </div>

          {/* Rest of the scheduling options remain the same */}
          {/* ... */}
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
            Schedule Announcements
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementScheduler;