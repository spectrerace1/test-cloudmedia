import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, Music2 } from 'lucide-react';
import CreateEventModal from './CreateEventModal';
import EventDetailModal from './EventDetailModal';
import { Event, EventFormData } from './types';
import './calendar.css';

// Predefined color combinations for events
const eventColors = [
  { bg: 'rgba(79, 70, 229, 0.1)', border: 'rgb(79, 70, 229)', text: 'rgb(79, 70, 229)' }, // Indigo
  { bg: 'rgba(236, 72, 153, 0.1)', border: 'rgb(236, 72, 153)', text: 'rgb(236, 72, 153)' }, // Pink
  { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgb(16, 185, 129)', text: 'rgb(16, 185, 129)' }, // Green
  { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgb(245, 158, 11)', text: 'rgb(245, 158, 11)' }, // Amber
  { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgb(99, 102, 241)', text: 'rgb(99, 102, 241)' }, // Blue
  { bg: 'rgba(217, 70, 239, 0.1)', border: 'rgb(217, 70, 239)', text: 'rgb(217, 70, 239)' }, // Purple
  { bg: 'rgba(14, 165, 233, 0.1)', border: 'rgb(14, 165, 233)', text: 'rgb(14, 165, 233)' }, // Sky
  { bg: 'rgba(234, 88, 12, 0.1)', border: 'rgb(234, 88, 12)', text: 'rgb(234, 88, 12)' }, // Orange
  { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgb(168, 85, 247)', text: 'rgb(168, 85, 247)' }, // Violet
  { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgb(59, 130, 246)', text: 'rgb(59, 130, 246)' }  // Blue
];

const ScheduleCalendar: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedView, setSelectedView] = useState<'timeGridWeek' | 'timeGridDay'>('timeGridWeek');
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);
  const [colorIndex, setColorIndex] = useState(0);

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Summer Hits 2024',
      start: '2024-03-20T10:00:00',
      end: '2024-03-20T18:00:00',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      borderColor: 'rgb(79, 70, 229)',
      textColor: 'rgb(79, 70, 229)',
      type: 'playlist',
      branch: 'Downtown Branch',
      playlist: 'Summer Hits 2024',
      description: 'Regular playlist schedule'
    },
    {
      id: '2',
      title: 'Store Closing Announcement',
      start: '2024-03-20T19:45:00',
      end: '2024-03-20T20:00:00',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgb(245, 158, 11)',
      textColor: 'rgb(245, 158, 11)',
      type: 'announcement',
      branch: 'Mall Location',
      playlist: '',
      description: 'Daily closing announcement'
    }
  ]);

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    // Convert dates to local timezone
    const start = new Date(selectInfo.start.valueOf());
    const end = new Date(selectInfo.end.valueOf());

    // Adjust for timezone offset
    const timezoneOffset = start.getTimezoneOffset() * 60000;
    const localStart = new Date(start.getTime() - timezoneOffset);
    const localEnd = new Date(end.getTime() - timezoneOffset);

    setSelectedDates({
      start: localStart,
      end: localEnd
    });
    setShowCreateModal(true);
  };

  const handleEventEdit = (formData: EventFormData) => {
    if (selectedEvent) {
      const updatedEvents = events.map(event => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            title: formData.title,
            start: `${formData.startDate}T${formData.startTime}`,
            end: `${formData.endDate}T${formData.endTime}`,
            description: formData.description,
            branch: formData.branches[0] || event.branch,
            playlist: formData.playlist || event.playlist
          };
        }
        return event;
      });
      setEvents(updatedEvents);
      setSelectedEvent(null);
    }
  };

  const handleEventDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setSelectedEvent(null);
    }
  };

  const handleEventCreate = (formData: EventFormData) => {
    // Get next color and update index
    const color = eventColors[colorIndex];
    setColorIndex((prevIndex) => (prevIndex + 1) % eventColors.length);

    const newEvent: Event = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      start: `${formData.startDate}T${formData.startTime}`,
      end: `${formData.endDate}T${formData.endTime}`,
      backgroundColor: color.bg,
      borderColor: color.border,
      textColor: color.text,
      type: 'playlist',
      branch: formData.branches[0] || '',
      playlist: formData.playlist || '',
      description: formData.description
    };

    setEvents([...events, newEvent]);
    setShowCreateModal(false);
    setSelectedDates(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Schedule</h2>
            <p className="text-gray-600 mt-1">Manage your playlists and announcements schedule</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={selectedView}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          expandRows={true}
          height="auto"
          allDaySlot={false}
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          eventClick={handleEventClick}
          select={handleDateSelect}
          eventContent={(eventInfo) => (
            <div className="flex flex-col p-1">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4" />
                <span className="font-medium">{eventInfo.event.title}</span>
              </div>
              {eventInfo.event.extendedProps.playlist && (
                <span className="text-sm opacity-75 mt-0.5">
                  {eventInfo.event.extendedProps.playlist}
                </span>
              )}
            </div>
          )}
          views={{
            timeGridWeek: {
              titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
            },
            timeGridDay: {
              titleFormat: { year: 'numeric', month: 'long', day: 'numeric' }
            }
          }}
        />
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDates(null);
          }}
          onSave={handleEventCreate}
          initialDates={selectedDates}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleEventEdit}
          onDelete={handleEventDelete}
        />
      )}
    </div>
  );
};

export default ScheduleCalendar;