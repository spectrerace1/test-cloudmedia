import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';

interface GroupSelectorProps {
  selectedGroups: string[];
  onGroupSelect: (groups: string[]) => void;
}

const mockGroups = [
  { id: 'group-1', name: 'City Center', branchCount: 45, region: 'North' },
  { id: 'group-2', name: 'Shopping Malls', branchCount: 38, region: 'Central' },
  { id: 'group-3', name: 'Airport Locations', branchCount: 22, region: 'West' },
  { id: 'group-4', name: 'Downtown Area', branchCount: 35, region: 'East' },
  { id: 'group-5', name: 'Plaza Network', branchCount: 28, region: 'South' }
];

const GroupSelector: React.FC<GroupSelectorProps> = ({
  selectedGroups,
  onGroupSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = mockGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedGroups.length === filteredGroups.length) {
      onGroupSelect([]);
    } else {
      onGroupSelect(filteredGroups.map(group => group.id));
    }
  };

  const toggleGroup = (groupId: string) => {
    onGroupSelect(
      selectedGroups.includes(groupId)
        ? selectedGroups.filter(id => id !== groupId)
        : [...selectedGroups, groupId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={toggleSelectAll}
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
        >
          {selectedGroups.length === filteredGroups.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
        <div className="space-y-2 p-2">
          {filteredGroups.map((group) => (
            <label
              key={group.id}
              className={`flex items-center p-3 rounded border ${
                selectedGroups.includes(group.id)
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:bg-gray-50'
              } cursor-pointer`}
            >
              <input
                type="checkbox"
                checked={selectedGroups.includes(group.id)}
                onChange={() => toggleGroup(group.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{group.name}</div>
                    <div className="text-xs text-gray-500">{group.region} Region</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {group.branchCount} branches
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Selected: {selectedGroups.length} of {filteredGroups.length} groups
      </div>
    </div>
  );
};

export default GroupSelector;