import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleSettingsProps {
  playType: 'after_song' | 'per_minute' | 'on_clock';
  interval: number;
  playOrder: 'serial' | 'random';
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  selectedDays: string[];
  onPlayTypeChange: (type: 'after_song' | 'per_minute' | 'on_clock') => void;
  onIntervalChange: (value: number) => void;
  onPlayOrderChange: (order: 'serial' | 'random') => void;
  onDateChange: (start: string, end: string) => void;
  onTimeChange: (start: string, end: string) => void;
  onDaysChange: (days: string[]) => void;
}

const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({
  playType,
  interval,
  playOrder,
  startDate,
  endDate,
  startTime,
  endTime,
  selectedDays,
  onPlayTypeChange,
  onIntervalChange,
  onPlayOrderChange,
  onDateChange,
  onTimeChange,
  onDaysChange,
}) => {
  const days = [
    { id: 'mon', label: 'M' },
    { id: 'tue', label: 'T' },
    { id: 'wed', label: 'W' },
    { id: 'thu', label: 'T' },
    { id: 'fri', label: 'F' },
    { id: 'sat', label: 'S' },
    { id: 'sun', label: 'S' }
  ];

  return (
    <div className="space-y-8">
      {/* Play Settings */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900">Play Settings</h3>
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => onPlayOrderChange('serial')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  playOrder === 'serial'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Serial
              </button>
              <button
                onClick={() => onPlayOrderChange('random')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  playOrder === 'random'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Random
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Play after song */}
            <div 
              onClick={() => onPlayTypeChange('after_song')}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                playType === 'after_song'
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                checked={playType === 'after_song'}
                onChange={() => onPlayTypeChange('after_song')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-3 flex-1">Play after</span>
              {playType === 'after_song' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={interval}
                    onChange={(e) => onIntervalChange(parseInt(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-sm text-gray-600">songs</span>
                </div>
              )}
            </div>

            {/* Play every minute */}
            <div 
              onClick={() => onPlayTypeChange('per_minute')}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                playType === 'per_minute'
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                checked={playType === 'per_minute'}
                onChange={() => onPlayTypeChange('per_minute')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-3 flex-1">Play every</span>
              {playType === 'per_minute' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={interval}
                    onChange={(e) => onIntervalChange(parseInt(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md text-sm"
                  />
                  <span className="text-sm text-gray-600">minutes</span>
                </div>
              )}
            </div>

            {/* Ring on the clock */}
            <div 
              onClick={() => onPlayTypeChange('on_clock')}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                playType === 'on_clock'
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                checked={playType === 'on_clock'}
                onChange={() => onPlayTypeChange('on_clock')}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="ml-3">Ring on the clock</span>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-gray-900">Schedule</h3>
            <span className="text-sm text-gray-500 italic">* Leave empty for indefinite schedule</span>
          </div>

          <div className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onDateChange(e.target.value, endDate)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="--/--/----"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onDateChange(startDate, e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="--/--/----"
                  />
                </div>
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => onTimeChange(e.target.value, endTime)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="--:--"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">End Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => onTimeChange(startTime, e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="--:--"
                  />
                </div>
              </div>
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Working Days</label>
              <div className="flex gap-2">
                {days.map((day) => (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      onDaysChange(
                        selectedDays.includes(day.id)
                          ? selectedDays.filter(d => d !== day.id)
                          : [...selectedDays, day.id]
                      );
                    }}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      selectedDays.includes(day.id)
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSettings;