import React, { useState } from 'react';
import { X, Search, Building2, Users, Check } from 'lucide-react';

interface PushPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistName: string;
  onPush: (targets: { type: 'branch' | 'group'; id: string }[]) => void;
}

const PushPlaylistModal: React.FC<PushPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlistName,
  onPush
}) => {
  const [activeTab, setActiveTab] = useState<'branches' | 'groups'>('branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTargets, setSelectedTargets] = useState<{ type: 'branch' | 'group'; id: string }[]>([]);

  // Mock data - In real app, this would come from an API
  const branches = Array.from({ length: 200 }, (_, i) => ({
    id: `BR${String(i + 1).padStart(3, '0')}`,
    name: `Branch ${i + 1}`,
    location: `Location ${Math.floor(i / 20) + 1}`,
    type: ['Mall', 'Street', 'Airport', 'Plaza'][Math.floor(Math.random() * 4)],
    status: Math.random() > 0.2 ? 'online' : 'offline'
  }));

  const groups = [
    { id: 'G001', name: 'City Center', branchCount: 45, region: 'North' },
    { id: 'G002', name: 'Shopping Malls', branchCount: 38, region: 'Central' },
    { id: 'G003', name: 'Airport Locations', branchCount: 22, region: 'West' },
    { id: 'G004', name: 'Downtown Area', branchCount: 35, region: 'East' },
    { id: 'G005', name: 'Plaza Network', branchCount: 28, region: 'South' }
  ];

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'branches') {
      return branches.filter(branch => 
        branch.name.toLowerCase().includes(term) || 
        branch.location.toLowerCase().includes(term) ||
        branch.type.toLowerCase().includes(term)
      );
    }
    return groups.filter(group => 
      group.name.toLowerCase().includes(term) || 
      group.region.toLowerCase().includes(term)
    );
  };

  const handleSelectAll = () => {
    if (activeTab === 'branches') {
      const allBranchTargets = filteredItems().map(branch => ({ type: 'branch' as const, id: branch.id }));
      setSelectedTargets(prev => {
        const nonBranchTargets = prev.filter(t => t.type !== 'branch');
        return prev.length === (nonBranchTargets.length + allBranchTargets.length)
          ? nonBranchTargets
          : [...nonBranchTargets, ...allBranchTargets];
      });
    } else {
      const allGroupTargets = filteredItems().map(group => ({ type: 'group' as const, id: group.id }));
      setSelectedTargets(prev => {
        const nonGroupTargets = prev.filter(t => t.type !== 'group');
        return prev.length === (nonGroupTargets.length + allGroupTargets.length)
          ? nonGroupTargets
          : [...nonGroupTargets, ...allGroupTargets];
      });
    }
  };

  const handleToggleTarget = (type: 'branch' | 'group', id: string) => {
    setSelectedTargets(prev => {
      const exists = prev.some(target => target.type === type && target.id === id);
      if (exists) {
        return prev.filter(target => !(target.type === type && target.id === id));
      }
      return [...prev, { type, id }];
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 flex flex-col" style={{ height: 'calc(100vh - 100px)' }}>
        {/* Header - Fixed */}
        <div className="flex-none p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Push Playlist</h2>
              <p className="text-gray-600 mt-1">Select targets for "{playlistName}"</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('branches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'branches'
                  ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Individual Branches
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'groups'
                  ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Branch Groups
            </button>
          </div>
        </div>

        {/* Search and Content - Scrollable */}
        <div className="flex-1 p-6 space-y-4 overflow-hidden">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              {activeTab === 'branches'
                ? selectedTargets.filter(t => t.type === 'branch').length === filteredItems().length
                  ? 'Deselect All'
                  : 'Select All'
                : selectedTargets.filter(t => t.type === 'group').length === filteredItems().length
                  ? 'Deselect All'
                  : 'Select All'
              }
            </button>
          </div>

          {/* Selection List */}
          <div className="h-[calc(100%-4rem)] overflow-hidden">
            <div className="grid grid-cols-2 gap-4 h-full overflow-y-auto hide-scrollbar">
              {activeTab === 'branches' ? (
                filteredItems().map((branch: any) => (
                  <label
                    key={branch.id}
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTargets.some(t => t.type === 'branch' && t.id === branch.id)
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-100'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedTargets.some(t => t.type === 'branch' && t.id === branch.id)}
                      onChange={() => handleToggleTarget('branch', branch.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{branch.name}</span>
                        </div>
                        {selectedTargets.some(t => t.type === 'branch' && t.id === branch.id) && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">{branch.location}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{branch.type}</span>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                filteredItems().map((group: any) => (
                  <label
                    key={group.id}
                    className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedTargets.some(t => t.type === 'group' && t.id === group.id)
                        ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-100'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={selectedTargets.some(t => t.type === 'group' && t.id === group.id)}
                      onChange={() => handleToggleTarget('group', group.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{group.name}</span>
                        </div>
                        {selectedTargets.some(t => t.type === 'group' && t.id === group.id) && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">{group.region}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{group.branchCount} branches</span>
                      </div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-none p-6 bg-gray-50 border-t border-gray-100 rounded-b-xl flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedTargets.length} {selectedTargets.length === 1 ? 'target' : 'targets'} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedTargets.length === 0) {
                  alert('Please select at least one target');
                  return;
                }
                onPush(selectedTargets);
                onClose();
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Push Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PushPlaylistModal;