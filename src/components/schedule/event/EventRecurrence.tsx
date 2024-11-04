import React from 'react';
import { EventFormData, ValidationError } from '../types';

interface EventRecurrenceProps {
  formData: EventFormData;
  onChange: (recurrence: EventFormData['recurrence']) => void;
  errors: ValidationError[];
}

const EventRecurrence: React.FC<EventRecurrenceProps> = ({ formData, onChange, errors }) => {
  const { recurrence } = formData;

  return (
    <div className="space-y-6">
      {/* Enable Recurrence */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="recurrence-enabled"
          checked={recurrence.enabled}
          onChange={(e) => onChange({ ...recurrence, enabled: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="recurrence-enabled" className="text-sm font-medium text-gray-700">
          Enable Recurrence
        </label>
      </div>

      {recurrence.enabled && (
        <div className="space-y-6">
          {/* Recurrence Type and Interval */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat Type
              </label>
              <select
                value={recurrence.type}
                onChange={(e) => onChange({ ...recurrence, type: e.target.value as 'weekly' | 'monthly' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat Every
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={recurrence.interval}
                  onChange={(e) => onChange({ ...recurrence, interval: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-600">
                  {recurrence.type === 'weekly' ? 'week(s)' : 'month(s)'}
                </span>
              </div>
            </div>
          </div>

          {/* Weekly/Monthly Options */}
          {recurrence.type === 'weekly' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat On
              </label>
              <div className="flex gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      const dayLower = day.toLowerCase();
                      onChange({
                        ...recurrence,
                        repeatDays: recurrence.repeatDays.includes(dayLower)
                          ? recurrence.repeatDays.filter(d => d !== dayLower)
                          : [...recurrence.repeatDays, dayLower]
                      });
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${
                      recurrence.repeatDays.includes(day.toLowerCase())
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day[0]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Dates
              </label>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => {
                      onChange({
                        ...recurrence,
                        selectedDates: recurrence.selectedDates.includes(date)
                          ? recurrence.selectedDates.filter(d => d !== date)
                          : [...recurrence.selectedDates, date]
                      });
                    }}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      recurrence.selectedDates.includes(date)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* End After */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End After
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={recurrence.endAfter}
                onChange={(e) => onChange({ ...recurrence, endAfter: parseInt(e.target.value) })}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-600">occurrences (0 = no end)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRecurrence;