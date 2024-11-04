import React, { useState } from 'react';
import { Search, Building2, Users, Check } from 'lucide-react';
import { EventFormData, ValidationError } from '../types';

interface EventTargetSelectionProps {
  formData: EventFormData;
  onChange: (data: Partial<EventFormData>) => void;
  errors: ValidationError[];
}

// Mock data
const branches = [
  { id: 'br1', name: 'Downtown Mall', location: 'City Center', status: 'online' },
  { id: 'br2', name: 'Airport Terminal', location: 'Airport District', status: 'online' },
  { id: 'br3', name: 'Central Plaza', location: 'Business District', status: 'online' },
  { id: 'br4', name: 'Waterfront Store', location: 'Harbor Area', status: 'online' },
  { id: 'br5', name: 'Metro Station', location: 'Transit Hub', status: 'online' }
];

const groups = [
  { id: 'g1', name: 'Shopping Centers', branchCount: 25, region: 'Central' },
  { id: 'g2', name: 'Transportation Hubs', branchCount: 15, region: 'Various' },
  { id: 'g3', name: 'Business Districts', branchCount: 20, region: 'Downtown' },
  { id: 'g4', name: 'Entertainment Zones', branchCount: 18, region: 'Mixed' },
  { id: 'g5', name: 'Educational Campuses', branchCount: 12, region: 'Various' }
];

const EventTargetSelection: React.FC<EventTargetSelectionProps> = ({ formData, onChange, errors }) => {
  const [activeTab, setActiveTab] = useState<'branches' | 'groups'>('branches');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'branches') {
      return branches.filter(branch => 
        branch.name.toLowerCase().includes(term) || 
        branch.location.toLowerCase().includes(term)
      );
    } else {
      return groups.filter(group => 
        group.name.toLowerCase().includes(term) || 
        group.region.toLowerCase().includes(term)
      );
    }
  };

  const handleSelectAll = () => {
    if (activeTab === 'branches') {
      const allBranchIds = branches.map(b => b.id);
      onChange({
        branches: formData.branches.length === allBranchIds.length ? [] : allBranchIds
      });
    } else {
      const allGroupIds = groups.map(g => g.id);
      onChange({
        groups: formData.groups.length === allGroupIds.length ? [] : allGroupIds
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Selection */}
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('branches')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'branches'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Branches
        </button>
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'groups'
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Groups
        </button>
      </div>

      {/* Search and Select All */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={handleSelectAll}
          className="ml-4 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg"
        >
          {activeTab === 'branches'
            ? formData.branches.length === branches.length ? 'Deselect All' : 'Select All'
            : formData.groups.length === groups.length ? 'Deselect All' : 'Select All'
          }
        </button>
      </div>

      {/* Selection List */}
      <div className="border border-gray-200 rounded-lg">
        <div className="max-h-[300px] overflow-y-auto p-2">
          <div className="grid grid-cols-2 gap-2">
            {activeTab === 'branches' ? (
              filteredItems().map((branch: any) => (
                <label
                  key={branch.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                    formData.branches.includes(branch.id)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.branches.includes(branch.id)}
                    onChange={() => {
                      onChange({
                        branches: formData.branches.includes(branch.id)
                          ? formData.branches.filter(id => id !== branch.id)
                          : [...formData.branches, branch.id]
                      });
                    }}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{branch.name}</span>
                      </div>
                      {formData.branches.includes(branch.id) && (
                        <Check className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{branch.location}</p>
                  </div>
                </label>
              ))
            ) : (
              filteredItems().map((group: any) => (
                <label
                  key={group.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer ${
                    formData.groups.includes(group.id)
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.groups.includes(group.id)}
                    onChange={() => {
                      onChange({
                        groups: formData.groups.includes(group.id)
                          ? formData.groups.filter(id => id !== group.id)
                          : [...formData.groups, group.id]
                      });
                    }}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{group.name}</span>
                      </div>
                      {formData.groups.includes(group.id) && (
                        <Check className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {group.branchCount} branches • {group.region}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventTargetSelection;