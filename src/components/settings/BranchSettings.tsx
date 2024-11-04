import React, { useState } from 'react';
import { Building2, Users, Check, Search, AlertTriangle, Volume2, VolumeX, ChevronDown } from 'lucide-react';

interface Branch {
  id: number;
  name: string;
  code: string;
}

interface Group {
  id: number;
  name: string;
  branches: number[];
}

const mockBranches: Branch[] = [
  { id: 1, name: 'Downtown Branch', code: 'BR001' },
  { id: 2, name: 'Mall Location', code: 'BR002' },
  { id: 3, name: 'Airport Store', code: 'BR003' },
  { id: 4, name: 'Central Plaza', code: 'BR004' },
  { id: 5, name: 'Harbor Point', code: 'BR005' },
  { id: 6, name: 'City Mall', code: 'BR006' },
  { id: 7, name: 'West Station', code: 'BR007' },
  { id: 8, name: 'East Point', code: 'BR008' }
];

const mockGroups: Group[] = [
  { id: 1, name: 'City Center', branches: [1, 4] },
  { id: 2, name: 'Shopping Centers', branches: [2, 5, 6] },
  { id: 3, name: 'Transportation Hubs', branches: [3, 7] },
  { id: 4, name: 'East Region', branches: [8] }
];

const BranchSettings: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [volume, setVolume] = useState(75);
  const [openingTime, setOpeningTime] = useState('09:00');
  const [closingTime, setClosingTime] = useState('18:00');
  const [prayerCallEnabled, setPrayerCallEnabled] = useState(false);
  const [showEmergencyControls, setShowEmergencyControls] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [confirmEmergency, setConfirmEmergency] = useState(false);

  const filteredItems = () => {
    const term = searchTerm.toLowerCase();
    return {
      branches: mockBranches.filter(branch => 
        branch.name.toLowerCase().includes(term) || 
        branch.code.toLowerCase().includes(term)
      ),
      groups: mockGroups.filter(group => 
        group.name.toLowerCase().includes(term)
      )
    };
  };

  const handleSelection = (type: 'branch' | 'group' | 'all', item?: Branch | Group) => {
    if (type === 'all') {
      setIsAllSelected(true);
      setSelectedBranch(null);
      setSelectedGroup('');
    } else if (type === 'branch' && 'code' in item!) {
      setSelectedBranch(item as Branch);
      setSelectedGroup('');
      setIsAllSelected(false);
    } else if (type === 'group') {
      setSelectedGroup((item as Group).name);
      setSelectedBranch(null);
      setIsAllSelected(false);
    }
    setShowDropdown(false);
  };

  const clearSelection = () => {
    setSelectedBranch(null);
    setSelectedGroup('');
    setIsAllSelected(false);
  };

  const handleEmergencyStop = () => {
    if (!emergencyReason) {
      alert('Please provide a reason for emergency stop');
      return;
    }

    console.log('Emergency Stop:', {
      target: isAllSelected ? 'all' : selectedGroup ? `group:${selectedGroup}` : `branch:${selectedBranch?.name}`,
      reason: emergencyReason,
      timestamp: new Date().toISOString()
    });

    setConfirmEmergency(false);
    setEmergencyReason('');
  };

  const handleEmergencyResume = () => {
    console.log('Resume Playback:', {
      target: isAllSelected ? 'all' : selectedGroup ? `group:${selectedGroup}` : `branch:${selectedBranch?.name}`,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Branch Settings</h2>
            <p className="text-gray-600 mt-1">Manage settings for branches and groups</p>
          </div>
          {(selectedBranch || selectedGroup || isAllSelected) && (
            <button
              onClick={clearSelection}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>

      {/* Branch Selection */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative">
          <div
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex items-center gap-3">
              {isAllSelected ? (
                <Check className="w-5 h-5 text-indigo-600" />
              ) : selectedGroup ? (
                <Users className="w-5 h-5 text-indigo-600" />
              ) : selectedBranch ? (
                <Building2 className="w-5 h-5 text-indigo-600" />
              ) : (
                <Building2 className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-gray-900">
                {isAllSelected ? 'All Branches' : 
                 selectedGroup ? selectedGroup :
                 selectedBranch ? selectedBranch.name :
                 'Select Branch or Group'}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>

          {showDropdown && (
            <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search branches or groups..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <div 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                  onClick={() => handleSelection('all')}
                >
                  <Check className="w-5 h-5 text-indigo-600" />
                  <span className="text-gray-900">All Branches</span>
                </div>

                {filteredItems().groups.length > 0 && (
                  <>
                    <div className="px-3 py-2 bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Groups</span>
                    </div>
                    {filteredItems().groups.map(group => (
                      <div
                        key={group.id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        onClick={() => handleSelection('group', group)}
                      >
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{group.name}</span>
                      </div>
                    ))}
                  </>
                )}

                {filteredItems().branches.length > 0 && (
                  <>
                    <div className="px-3 py-2 bg-gray-50">
                      <span className="text-sm font-medium text-gray-700">Individual Branches</span>
                    </div>
                    {filteredItems().branches.map(branch => (
                      <div
                        key={branch.id}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        onClick={() => handleSelection('branch', branch)}
                      >
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{branch.name}</span>
                        <span className="text-sm text-gray-500">{branch.code}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {(selectedBranch || selectedGroup || isAllSelected) && (
        <div className="p-6 space-y-8">
          {/* Emergency Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Emergency Controls</h3>
              <button
                onClick={() => setShowEmergencyControls(!showEmergencyControls)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showEmergencyControls ? 'Hide Controls' : 'Show Controls'}
              </button>
            </div>

            {showEmergencyControls && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Warning</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Use these controls in emergency situations to immediately stop or resume music playback
                      {isAllSelected 
                        ? ' across all branches' 
                        : selectedGroup 
                          ? ` in ${selectedGroup} group` 
                          : ` in ${selectedBranch?.name}`}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setConfirmEmergency(true)}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <VolumeX className="w-4 h-4 mr-2" />
                    Emergency Stop
                  </button>
                  <button
                    onClick={handleEmergencyResume}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Resume Playback
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Volume Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Volume Settings</h3>
            <div className="flex items-center gap-4">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-gray-600 min-w-[3ch]">{volume}%</span>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Opening Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opening Time</label>
                <input
                  type="time"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Time</label>
                <input
                  type="time"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Prayer Call Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Prayer Call Settings</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={prayerCallEnabled}
                onChange={(e) => setPrayerCallEnabled(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Enable Prayer Call</span>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Emergency Stop Confirmation Modal */}
      {confirmEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Confirm Emergency Stop</h3>
                <p className="text-sm text-gray-500">
                  This will immediately stop all music playback
                  {isAllSelected 
                    ? ' across all branches' 
                    : selectedGroup 
                      ? ` in ${selectedGroup} group` 
                      : ` in ${selectedBranch?.name}`}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Emergency Stop
              </label>
              <select
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 mb-2"
              >
                <option value="">Select a reason...</option>
                <option value="emergency">Emergency Situation</option>
                <option value="disaster">Natural Disaster</option>
                <option value="technical">Technical Issues</option>
                <option value="maintenance">Emergency Maintenance</option>
                <option value="other">Other</option>
              </select>
              {emergencyReason === 'other' && (
                <textarea
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  placeholder="Please specify the reason..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  rows={3}
                />
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmEmergency(false);
                  setEmergencyReason('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyStop}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSettings;