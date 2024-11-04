import React, { useState } from 'react';
import { Play, Pause, Edit, Trash2, Music2 } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignFilesProps {
  campaign: Campaign;
}

const CampaignFiles: React.FC<CampaignFilesProps> = ({ campaign }) => {
  const [playingFile, setPlayingFile] = useState<number | null>(null);

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const handlePlayToggle = (index: number) => {
    setPlayingFile(playingFile === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2 className="w-5 h-5 text-gray-400" />
          <h3 className="font-medium text-gray-900">Campaign Files</h3>
        </div>
        <span className="text-sm text-gray-500">{campaign.files.length} files</span>
      </div>

      <div className="space-y-2">
        {campaign.files.map((file, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{file.duration}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePlayToggle(index)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
              >
                {playingFile === index ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignFiles;