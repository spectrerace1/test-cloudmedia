import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Campaigns</h2>
              <p className="text-gray-600 mt-1">Manage your announcement campaigns</p>
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </button>
          </div>
        </div>

        <CampaignList 
          campaigns={campaigns}
          setCampaigns={setCampaigns}
        />
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