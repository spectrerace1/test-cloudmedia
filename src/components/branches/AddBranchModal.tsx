import React, { useState } from 'react';
import { X, Building2, MapPin, Clock, Volume2 } from 'lucide-react';
import { Branch } from '../../types/branch';
import { branchService } from '../../services/api';

interface AddBranchModalProps {
  onClose: () => void;
  onAdd: (branch: Branch) => void;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ onClose, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    settings: {
      volume: 50,
      operatingHours: {
        start: '09:00',
        end: '18:00'
      },
      timezone: 'UTC+3'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newBranch = await branchService.createBranch(formData);
      onAdd(newBranch);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create branch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Branch</h2>
            <p className="text-sm text-gray-600 mt-1">Create a new branch location</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Branch Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter branch name"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter branch location"
                  required
                />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="time"
                    value={formData.settings.operatingHours.start}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        operatingHours: {
                          ...prev.settings.operatingHours,
                          start: e.target.value
                        }
                      }
                    }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Closing Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="time"
                    value={formData.settings.operatingHours.end}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: {
                        ...prev.settings,
                        operatingHours: {
                          ...prev.settings.operatingHours,
                          end: e.target.value
                        }
                      }
                    }))}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Default Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Volume
              </label>
              <div className="relative">
                <Volume2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.settings.volume}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    settings: {
                      ...prev.settings,
                      volume: parseInt(e.target.value)
                    }
                  }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranchModal;