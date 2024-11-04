import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Campaign } from '../types';
import ScheduleSettings from '../ScheduleSettings';

interface EditCampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

const EditCampaignModal: React.FC<EditCampaignModalProps> = ({
  campaign,
  onClose,
  onSave
}) => {
  // Campaign name state
  const [name, setName] = useState(campaign.name);

  // Schedule settings states
  const [playType, setPlayType] = useState<'after_song' | 'per_minute' | 'on_clock'>(
    campaign.schedule.type === 'schedule' ? 'on_clock' : 'per_minute'
  );
  const [interval, setInterval] = useState(campaign.schedule.interval || 1);
  const [playOrder, setPlayOrder] = useState<'serial' | 'random'>('serial');
  const [startDate, setStartDate] = useState(campaign.schedule.date || '');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState(campaign.schedule.time || '');
  const [endTime, setEndTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      ...campaign,
      name,
      schedule: {
        type: playType === 'on_clock' ? 'schedule' : 'now',
        date: startDate,
        time: startTime,
        interval: interval
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Edit Campaign</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Campaign Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter campaign name"
              />
            </div>

            {/* Schedule Settings Component */}
            <ScheduleSettings
              playType={playType}
              interval={interval}
              playOrder={playOrder}
              startDate={startDate}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              selectedDays={selectedDays}
              onPlayTypeChange={setPlayType}
              onIntervalChange={setInterval}
              onPlayOrderChange={setPlayOrder}
              onDateChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onTimeChange={(start, end) => {
                setStartTime(start);
                setEndTime(end);
              }}
              onDaysChange={setSelectedDays}
            />
          </div>

          <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaignModal;