import React from 'react';
import { Megaphone, Calendar, Clock, Edit, Trash2, ChevronDown } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignRowProps {
  campaign: Campaign;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
}

const CampaignRow: React.FC<CampaignRowProps> = ({
  campaign,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete
}) => {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Megaphone className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{campaign.name}</div>
            <div className="text-sm text-gray-500">
              {campaign.files.length} files
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {campaign.schedule.type === 'schedule' ? (
            <>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{campaign.schedule.date}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{campaign.schedule.time}</span>
              </div>
            </>
          ) : (
            <span className="text-indigo-600">Play Immediately</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          campaign.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : campaign.status === 'playing'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit(campaign);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(campaign);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button 
            onClick={onToggleExpand}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600"
          >
            <ChevronDown className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CampaignRow;