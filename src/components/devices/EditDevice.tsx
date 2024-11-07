import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';

interface DeviceStatus {
  ip: string;
  online: boolean;
  version: string;
  lastSeen: string;
  systemInfo: {
    os: string;
    memory: number;
    storage: number;
  };
}

interface Branch {
  id: string;
  name: string;
}

interface Device {
  id: string;
  token: string;
  name: string;
  status: DeviceStatus;
  branchId: string;
  branch: Branch;
}

interface EditDeviceProps {
  device: Device;
  onClose: () => void;
  onSave: (updatedDevice: Partial<Device>) => void;
}

const EditDevice: React.FC<EditDeviceProps> = ({ device, onClose, onSave }) => {
  const [deviceName, setDeviceName] = useState(device.name);
  const [selectedBranchId, setSelectedBranchId] = useState(device.branch.id);
  const [error, setError] = useState('');

  const branches = device.branch ? [device.branch] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!deviceName.trim()) {
      setError('Please enter a device name');
      return;
    }

    if (!selectedBranchId) {
      setError('Please select a branch');
      return;
    }

    onSave({
      ...device,
      name: deviceName,
      branchId: selectedBranchId
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Edit Device</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Device Token Display */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Token
            </label>
            <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600 font-mono">
              {device.token}
            </div>
          </div>

          {/* Device Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Name
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter device name"
              required
            />
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <div className="relative">
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none"
                required
              >
                <option value="">Select a branch</option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Device Status */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Device Status</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Last seen: {device.status.lastSeen}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                device.status.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {device.status.online ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </form>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDevice;
