import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleSectionProps {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  onDateChange: (start: string, end: string) => void;
  onTimeChange: (start: string, end: string) => void;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  startDate,
  endDate,
  startTime,
  endTime,
  onDateChange,
  onTimeChange
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
        <div className="text-sm text-gray-500 italic">
          * Leave empty for indefinite schedule
        </div>
      </div>

      <div className="space-y-6">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => onDateChange(e.target.value, endDate)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="--/--/----"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => onDateChange(startDate, e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="--/--/----"
              />
            </div>
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => onTimeChange(e.target.value, endTime)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="--:--"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => onTimeChange(startTime, e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="--:--"
              />
            </div>
          </div>
        </div>

        {/* Helper Text */}
        {(!startDate || !endDate || !startTime || !endTime) && (
          <div className="pt-2">
            {(!startDate || !endDate) && (
              <p className="text-sm text-indigo-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Campaign will run indefinitely if no dates are selected
              </p>
            )}
            {(!startTime || !endTime) && (
              <p className="text-sm text-indigo-600 flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Campaign will run 24/7 if no times are selected
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleSection;