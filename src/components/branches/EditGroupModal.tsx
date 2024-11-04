import React, { useState } from 'react';
import { X, FolderPlus, Building2, Music2 } from 'lucide-react';

interface BranchGroup {
  id: number;
  name: string;
  branchCount: number;
  playlist: string;
  lastUpdated: string;
  status: 'playing' | 'paused';
  hasAnnouncement: boolean;
}

interface EditGroupModalProps {
  group: BranchGroup;
  onClose: () => void;
  onSave: (groupData: any) => void;
}

const branches = [
  { id: 1, name: 'Downtown Branch' },
  { id: 2, name: 'Mall Location' },
  { id: 3, name: 'Airport Store' }
];

const playlists = [
  { id: 1, name: 'Summer Hits 2024' },
  { id: 2, name: 'Relaxing Jazz' },
  { id: 3, name: 'Pop Classics' }
];

const EditGroupModal: React.FC<EditGroupModalProps> = ({ group, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: group.name,
    description: '',
    branches: [],
    playlist: group.playlist
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleBranch = (branchId: number) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter(id => id !== branchId)
        : [...prev.branches, branchId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Group</h2>
            <p className="text-sm text-gray-600 mt-1">Update group settings and members</p>
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
                Group Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FolderPlus className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="Enter group name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter group description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Branches
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {branches.map((branch) => (
                  <label
                    key={branch.id}
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.branches.includes(branch.id)}
                      onChange={() => toggleBranch(branch.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{branch.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Playlist
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Music2 className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.playlist}
                  onChange={(e) => setFormData(prev => ({ ...prev, playlist: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                >
                  <option value="">Select a playlist</option>
                  {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.name}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
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

export default EditGroupModal;