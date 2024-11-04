import React, { useState } from 'react';
import { Building2, Users, Search, Check } from 'lucide-react';

interface BranchSelectorProps {
  selectedBranches: string[];
  selectedGroups: string[];
  onBranchesChange: (branches: string[]) => void;
  onGroupsChange: (groups: string[]) => void;
}

// Mock data - In real app, this would come from an API
const branches = Array.from({ length: 200 }, (_, i) => ({
  id: `BR${String(i + 1).padStart(3, '0')}`,
  name: `Branch ${i + 1}`,
  region: `Region ${Math.floor(i / 40) + 1}`,
  city: `City ${Math.floor(i / 20) + 1}`,
  status: Math.random() > 0.2 ? 'online' : 'offline'
}));

const groups = [
  { id: 'G001', name: 'City Center Branches', region: 'Region 1', branchCount: 45 },
  { id: 'G002', name: 'Shopping Malls', region: 'Region 2', branchCount: 38 },
  { id: 'G003', name: 'Airport Locations', region: 'Region 3', branchCount: 22 },
  { id: 'G004', name: 'Downtown Area', region: 'Region 1', branchCount: 35 },
  { id: 'G005', name: 'Plaza Network', region: 'Region 4', branchCount: 28 }
];

const BranchSelector: React.FC<BranchSelectorProps> = ({
  selectedBranches,
  selectedGroups,
  onBranchesChange,
  onGroupsChange
}) => {
  const [activeTab, setActiveTab] = useState<'branches' | 'groups'>('branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const regions = Array.from(new Set(branches.map(b => b.region)));

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || branch.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAllBranches = () => {
    if (selectedBranches.length === filteredBranches.length) {
      onBranchesChange([]);
    } else {
      onBranchesChange(filteredBranches.map(b => b.id));
    }
  };

  const handleSelectAllGroups = () => {
    if (selectedGroups.length === filteredGroups.length) {
      onGroupsChange([]);
    } else {
      onGroupsChange(filteredGroups.map(g => g.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            activeTab === 'branches'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="font-medium">Individual Branches</span>
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${
            activeTab === 'groups'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="font-medium">Branch Groups</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab === 'branches' ? 'branches' : 'groups'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {activeTab === 'branches' && (
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Regions</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        )}
      </div>

      {/* Selection List */}
      <div className="border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="font-medium text-gray-900">
            {activeTab === 'branches' ? 'Select Branches' : 'Select Groups'}
          </span>
          <button
            onClick={activeTab === 'branches' ? handleSelectAllBranches : handleSelectAllGroups}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {activeTab === 'branches' 
              ? selectedBranches.length === filteredBranches.length ? 'Deselect All' : 'Select All'
              : selectedGroups.length === filteredGroups.length ? 'Deselect All' : 'Select All'
            }
          </button>
        </div>
        <div className="max-h-[400px] overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-2">
            {activeTab === 'branches' ? (
              filteredBranches.map(branch => (
                <label
                  key={branch.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                    selectedBranches.includes(branch.id)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedBranches.includes(branch.id)}
                    onChange={() => {
                      if (selectedBranches.includes(branch.id)) {
                        onBranchesChange(selectedBranches.filter(id => id !== branch.id));
                      } else {
                        onBranchesChange([...selectedBranches, branch.id]);
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{branch.name}</span>
                      </div>
                      {selectedBranches.includes(branch.id) && (
                        <Check className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm">
                      <span className="text-gray-500">{branch.city}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{branch.region}</span>
                    </div>
                  </div>
                </label>
              ))
            ) : (
              filteredGroups.map(group => (
                <label
                  key={group.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                    selectedGroups.includes(group.id)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => {
                      if (selectedGroups.includes(group.id)) {
                        onGroupsChange(selectedGroups.filter(id => id !== group.id));
                      } else {
                        onGroupsChange([...selectedGroups, group.id]);
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{group.name}</span>
                      </div>
                      {selectedGroups.includes(group.id) && (
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

      {/* Selection Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600">
          {activeTab === 'branches' ? (
            <span>
              {selectedBranches.length} {selectedBranches.length === 1 ? 'branch' : 'branches'} selected
            </span>
          ) : (
            <span>
              {selectedGroups.length} {selectedGroups.length === 1 ? 'group' : 'groups'} selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchSelector;