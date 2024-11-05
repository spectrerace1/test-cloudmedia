import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';
import AnnouncementUploadModal from './AnnouncementUploadModal';
import CampaignList from './campaigns/CampaignList';
import { Campaign } from './types';

const initialCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Karpa Market Ekim Kampanyası",
    files: [
      { name: "Kampanya-1.mp3", size: 2048576, duration: "0:30", order: 1, isPlaying: false },
      { name: "Kampanya-2.mp3", size: 3145728, duration: "0:45", order: 2, isPlaying: false }
    ],
    schedule: {
      type: 'schedule',
      date: '2024-03-01',
      time: '09:00',
      interval: 30
    },
    status: 'pending'
  },
  {
    id: 2,
    name: "Yılbaşı İndirimleri",
    files: [
      { name: "YilbasiDuyuru.mp3", size: 4194304, duration: "1:00", order: 1, isPlaying: false }
    ],
    schedule: {
      type: 'now'
    },
    status: 'playing'
  }
];

const AnnouncementManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTour = localStorage.getItem('announcement-tour-completed');
    if (!hasSeenTour) {
      setRunTour(true);
    }
  }, []);

  const handleUpload = (data: any) => {
    const newCampaign: Campaign = {
      id: campaigns.length + 1,
      name: data.name,
      files: data.files.map((file: File, index: number) => ({
        name: file.name,
        size: file.size,
        duration: '0:30',
        order: index + 1,
        isPlaying: false
      })),
      schedule: {
        type: data.playType === 'scheduled' ? 'schedule' : 'now',
        date: data.scheduleDate,
        time: data.scheduleTime,
        interval: data.interval
      },
      status: 'pending'
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setShowUploadModal(false);
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem('announcement-tour-completed', 'true');
    }
  };

  const steps: Step[] = [
    {
      target: '.campaign-header',
      content: 'Welcome to the Announcements Manager! Here you can create and manage your announcement campaigns.',
      placement: 'center',
      disableBeacon: true
    },
    {
      target: '.create-campaign-btn',
      content: 'Click here to create a new announcement campaign. You can upload audio files and schedule them for playback.',
      placement: 'bottom'
    },
    {
      target: '.campaigns-list',
      content: 'Here you can see all your announcement campaigns. Each campaign can contain multiple audio files and can be scheduled to play at specific times.',
      placement: 'top'
    },
    {
      target: '.campaign-actions',
      content: 'Use these controls to manage your campaigns. You can edit schedules, preview audio files, and delete campaigns.',
      placement: 'left'
    }
  ];

  return (
    <div className="space-y-6">
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        styles={{
          options: {
            primaryColor: '#4F46E5',
            zIndex: 1000,
          },
        }}
        callback={handleJoyrideCallback}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center campaign-header">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Campaigns</h2>
              <p className="text-gray-600 mt-1">Manage your announcement campaigns</p>
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors create-campaign-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </button>
          </div>
        </div>

        <div className="campaigns-list">
          <CampaignList 
            campaigns={campaigns}
            setCampaigns={setCampaigns}
          />
        </div>
      </div>

      {showUploadModal && (
        <AnnouncementUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default AnnouncementManager;