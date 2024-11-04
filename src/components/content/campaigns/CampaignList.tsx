import React, { useState } from 'react';
import { Campaign } from '../types';
import CampaignRow from './CampaignRow';
import CampaignFiles from './CampaignFiles';
import EditCampaignModal from './EditCampaignModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface CampaignListProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, setCampaigns }) => {
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);

  const handleEditCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
  };

  const handleDeleteCampaign = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
  };

  const handleSaveEdit = (updatedCampaign: Campaign) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === updatedCampaign.id ? updatedCampaign : campaign
    ));
    setEditingCampaign(null);
  };

  const handleConfirmDelete = () => {
    if (deletingCampaign) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== deletingCampaign.id));
      setDeletingCampaign(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left px-6 py-4 text-gray-600 font-medium text-base">Campaign</th>
            <th className="text-left px-6 py-4 text-gray-600 font-medium text-base">Schedule</th>
            <th className="text-left px-6 py-4 text-gray-600 font-medium text-base">Status</th>
            <th className="text-right px-6 py-4 text-gray-600 font-medium text-base">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <React.Fragment key={campaign.id}>
              <CampaignRow
                campaign={campaign}
                isExpanded={expandedCampaign === campaign.id}
                onToggleExpand={() => setExpandedCampaign(
                  expandedCampaign === campaign.id ? null : campaign.id
                )}
                onEdit={() => handleEditCampaign(campaign)}
                onDelete={() => handleDeleteCampaign(campaign)}
              />
              {expandedCampaign === campaign.id && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 bg-gray-50">
                    <CampaignFiles campaign={campaign} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {editingCampaign && (
        <EditCampaignModal
          campaign={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deletingCampaign && (
        <DeleteConfirmModal
          campaign={deletingCampaign}
          onClose={() => setDeletingCampaign(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default CampaignList;