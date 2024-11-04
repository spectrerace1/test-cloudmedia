import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { AudioFile } from './types';
import FileUploadSection from './FileUploadSection';
import ScheduleSettings from './ScheduleSettings';
import BranchSelector from './BranchSelector';

interface AnnouncementUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => void;
}

const AnnouncementUploadModal: React.FC<AnnouncementUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'schedule' | 'target'>('upload');
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);

  // Schedule Settings State
  const [playType, setPlayType] = useState<'after_song' | 'per_minute' | 'on_clock'>('after_song');
  const [interval, setInterval] = useState(1);
  const [playOrder, setPlayOrder] = useState<'serial' | 'random'>('serial');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['mon', 'tue', 'wed', 'thu', 'fri']);

  // Target Selection State
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const audioFiles = Array.from(e.target.files)
        .filter(file => file.type.startsWith('audio/'))
        .map(file => ({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          order: files.length + 1,
          preview: {
            audio: new Audio(URL.createObjectURL(file)),
            isPlaying: false,
            duration: '0:00'
          }
        }));
      setFiles(prev => [...prev, ...audioFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter(file => file.type.startsWith('audio/'))
      .map(file => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        order: files.length + 1,
        preview: {
          audio: new Audio(URL.createObjectURL(file)),
          isPlaying: false,
          duration: '0:00'
        }
      }));

    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleSubmit = () => {
    // Stop all playing audio
    files.forEach(file => {
      if (file.preview?.audio) {
        file.preview.audio.pause();
        URL.revokeObjectURL(file.preview.audio.src);
      }
    });

    onUpload({
      name: campaignName,
      files: files.map(f => f.file),
      schedule: {
        playType,
        interval,
        playOrder,
        startDate,
        endDate,
        startTime,
        endTime,
        selectedDays
      },
      targets: {
        branches: selectedBranches,
        groups: selectedGroups
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentStep === 'upload' && 'Upload Announcements'}
                {currentStep === 'schedule' && 'Schedule Settings'}
                {currentStep === 'target' && 'Target Selection'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className={`h-1 w-8 rounded ${currentStep === 'upload' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`h-1 w-8 rounded ${currentStep === 'schedule' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                <div className={`h-1 w-8 rounded ${currentStep === 'target' ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto modal-scroll">
          {currentStep === 'upload' && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter campaign name"
                />
              </div>
              <FileUploadSection
                files={files}
                dragActive={dragActive}
                currentlyPlaying={currentlyPlaying}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={handleDrop}
                onFileInput={handleFileInput}
                onFilesReorder={setFiles}
                onRemoveFile={(index) => {
                  const newFiles = [...files];
                  newFiles.splice(index, 1);
                  setFiles(newFiles);
                }}
                onTogglePlay={setCurrentlyPlaying}
              />
            </>
          )}

          {currentStep === 'schedule' && (
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
          )}

          {currentStep === 'target' && (
            <BranchSelector
              selectedBranches={selectedBranches}
              selectedGroups={selectedGroups}
              onBranchesChange={setSelectedBranches}
              onGroupsChange={setSelectedGroups}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between">
          {currentStep !== 'upload' && (
            <button
              onClick={() => setCurrentStep(currentStep === 'target' ? 'schedule' : 'upload')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
            >
              Back
            </button>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (currentStep === 'upload') {
                  if (!campaignName || files.length === 0) return;
                  setCurrentStep('schedule');
                } else if (currentStep === 'schedule') {
                  setCurrentStep('target');
                } else {
                  handleSubmit();
                }
              }}
              disabled={currentStep === 'upload' && (!campaignName || files.length === 0)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 'target' ? 'Create Campaign' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementUploadModal;