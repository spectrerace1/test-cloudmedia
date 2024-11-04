import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Campaign } from '../types';

interface DeleteConfirmModalProps {
  campaign: Campaign;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  campaign,
  onClose,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Delete Campaign</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Are you sure you want to delete this campaign?</p>
              <p className="text-gray-600 mt-1">
                This will permanently delete "{campaign.name}" and all its associated files. 
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;