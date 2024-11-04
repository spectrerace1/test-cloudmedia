import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { EventFormData } from './types';
import { EventBasicInfo, EventRecurrence, EventTargetSelection } from './event';

interface CreateEventModalProps {
  onClose: () => void;
  onSave: (formData: EventFormData) => void;
  initialDates: { start: Date; end: Date } | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onSave, initialDates }) => {
  const [currentStep, setCurrentStep] = useState<'basic' | 'recurrence' | 'target'>('basic');
  const [errors, setErrors] = useState<Array<{ field: string; message: string }>>([]);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    type: 'playlist',
    playlist: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    branches: [],
    groups: [],
    description: '',
    recurrence: {
      enabled: false,
      type: 'weekly',
      interval: 1,
      endAfter: 0,
      monthlyType: 'dayOfMonth',
      selectedDates: [],
      repeatDays: []
    }
  });

  useEffect(() => {
    if (initialDates) {
      const startDate = initialDates.start.toISOString().split('T')[0];
      const endDate = initialDates.end.toISOString().split('T')[0];
      const startTime = initialDates.start.toTimeString().slice(0, 5);
      const endTime = initialDates.end.toTimeString().slice(0, 5);

      setFormData(prev => ({
        ...prev,
        startDate,
        endDate,
        startTime,
        endTime
      }));
    }
  }, [initialDates]);

  const validateStep = () => {
    const newErrors = [];

    if (currentStep === 'basic') {
      if (!formData.title) {
        newErrors.push({ field: 'title', message: 'Title is required' });
      }
      if (!formData.playlist) {
        newErrors.push({ field: 'playlist', message: 'Please select a playlist' });
      }
      if (!formData.startDate || !formData.endDate) {
        newErrors.push({ field: 'date', message: 'Start and end dates are required' });
      }
      if (!formData.startTime || !formData.endTime) {
        newErrors.push({ field: 'time', message: 'Start and end times are required' });
      }
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        newErrors.push({ field: 'date', message: 'End date must be after start date' });
      }
      if (formData.startDate === formData.endDate && formData.startTime >= formData.endTime) {
        newErrors.push({ field: 'time', message: 'End time must be after start time' });
      }
    } else if (currentStep === 'recurrence') {
      if (formData.recurrence.enabled) {
        if (formData.recurrence.type === 'weekly' && formData.recurrence.repeatDays.length === 0) {
          newErrors.push({ field: 'repeatDays', message: 'Please select at least one day' });
        }
        if (formData.recurrence.type === 'monthly' && formData.recurrence.selectedDates.length === 0) {
          newErrors.push({ field: 'selectedDates', message: 'Please select at least one date' });
        }
      }
    } else if (currentStep === 'target') {
      if (formData.branches.length === 0 && formData.groups.length === 0) {
        newErrors.push({ field: 'target', message: 'Please select at least one branch or group' });
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === 'basic') setCurrentStep('recurrence');
      else if (currentStep === 'recurrence') setCurrentStep('target');
      else if (currentStep === 'target') handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 'recurrence') setCurrentStep('basic');
    else if (currentStep === 'target') setCurrentStep('recurrence');
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSave(formData);
    }
  };

  const updateFormData = (data: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setErrors([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create Event</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`h-1 w-12 rounded ${currentStep === 'basic' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`h-1 w-12 rounded ${currentStep === 'recurrence' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`h-1 w-12 rounded ${currentStep === 'target' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar">
          {currentStep === 'basic' && (
            <EventBasicInfo
              formData={formData}
              onChange={updateFormData}
              errors={errors}
            />
          )}

          {currentStep === 'recurrence' && (
            <EventRecurrence
              formData={formData}
              onChange={(recurrence) => updateFormData({ recurrence })}
              errors={errors}
            />
          )}

          {currentStep === 'target' && (
            <EventTargetSelection
              formData={formData}
              onChange={updateFormData}
              errors={errors}
            />
          )}

          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">{error.message}</p>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between">
          <button
            onClick={currentStep === 'basic' ? onClose : handleBack}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            {currentStep === 'basic' ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <span>{currentStep === 'target' ? 'Create Event' : 'Next'}</span>
            {currentStep !== 'target' && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;