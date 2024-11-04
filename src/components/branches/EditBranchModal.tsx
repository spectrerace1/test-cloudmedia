import React, { useState } from 'react';
import { X, Building2, MapPin, Wifi, Volume2 } from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  devices: number;
  playlist: string;
  status: 'online' | 'offline';
  ip: string;
  hasAnnouncement: boolean;
}

interface EditBranchModalProps {
  branch: Branch;
  onClose: () => void;
  onSave: (branchData: any) => void;
}

const EditBranchModal: React.FC<EditBranchModalProps> = ({ branch, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: branch.name,
    ip: branch.ip,
    defaultVolume: 75,
    openingHours: {
      start: '09:00',
      end: '18:00'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Branch</h2>
            <p className="text-sm text-gray-600 mt-1">Update branch information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter branch name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Wifi className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.ip}
                  onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter IP address"
                  pattern="^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Volume
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Volume2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={formData.defaultVolume}
                  onChange={(e) => setFormData(prev => ({ ...prev, defaultVolume: parseInt(e.target.value) }))}
                  min="0"
                  max="100"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={formData.openingHours.start}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    openingHours: { ...prev.openingHours, start: e.target.value }
                  }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={formData.openingHours.end}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    openingHours: { ...prev.openingHours, end: e.target.value }
                  }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBranchModal;