import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';

interface AddDeviceProps {
  onClose: () => void;
}

const AddDevice: React.FC<AddDeviceProps> = ({ onClose }) => {
  const [deviceToken, setDeviceToken] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [error, setError] = useState('');

  // Mock branches data - In real app, this would come from an API
  const branches = [
    { id: 1, name: 'Downtown Branch' },
    { id: 2, name: 'Mall Location' },
    { id: 3, name: 'Airport Store' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate token format (6 characters alphanumeric)
    if (!/^[A-Z0-9]{6}$/.test(deviceToken)) {
      setError('Please enter a valid 6-character device token');
      return;
    }

    if (!selectedBranch) {
      setError('Please select a branch');
      return;
    }

    if (!deviceName.trim()) {
      setError('Please enter a device name');
      return;
    }

    // Here you would verify the token with your backend
    // and associate the device with the selected branch
    console.log('Device Registration:', {
      token: deviceToken,
      branchId: selectedBranch,
      name: deviceName
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Add New Device</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Device Token Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Token
            </label>
            <input
              type="text"
              value={deviceToken}
              onChange={(e) => setDeviceToken(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter 6-character token"
              maxLength={6}
              required
            />
            <p className="mt-2 text-sm text-gray-600">
              Enter the token displayed on your device
            </p>
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
              Select Branch
            </label>
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none"
                required
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
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

          {/* Instructions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">How to connect your device:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Enter the token displayed on your device screen</li>
              <li>Give your device a recognizable name</li>
              <li>Select the branch where this device will be used</li>
              <li>Click Connect to complete the setup</li>
            </ol>
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
            type="submit"
            form="device-form"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Connect Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;