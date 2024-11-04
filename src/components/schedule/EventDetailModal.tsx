import React, { useState } from 'react';
import { X, Calendar, Clock, Building2, Edit, Trash2 } from 'lucide-react';
import { Event, EventFormData } from './types';
import CreateEventModal from './CreateEventModal';

interface EventDetailModalProps {
  event: Event;
  onClose: () => void;
  onEdit: (formData: EventFormData) => void;
  onDelete: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onEdit,
  onDelete
}) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Convert event data to form data format for editing
  const getInitialFormData = (): EventFormData => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);

    return {
      title: event.title,
      description: event.description,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endTime: endDate.toTimeString().slice(0, 5),
      branches: [event.branch], // Convert single branch to array
      groups: [],
      recurrence: {
        enabled: false,
        type: 'weekly',
        interval: 1,
        endAfter: 0,
        monthlyType: 'dayOfMonth',
        selectedDates: [],
        repeatDays: []
      }
    };
  };

  if (showEditModal) {
    return (
      <CreateEventModal
        onClose={() => setShowEditModal(false)}
        onSave={(formData) => {
          onEdit(formData);
          setShowEditModal(false);
        }}
        initialData={getInitialFormData()}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.type === 'playlist'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-2">{event.title}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Time Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Start</p>
                <p className="text-sm text-gray-500">{formatDate(event.start)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">End</p>
                <p className="text-sm text-gray-500">{formatDate(event.end)}</p>
              </div>
            </div>
          </div>

          {/* Branch */}
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Branch</p>
              <p className="text-sm text-gray-500">{event.branch}</p>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-between">
          <button
            onClick={onDelete}
            className="inline-flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
            >
              Close
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;