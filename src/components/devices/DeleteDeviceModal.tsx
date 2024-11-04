import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface Device {
  id: number;
  token: string;
  name: string;
  branch: string;
  status: 'online' | 'offline';
  ip: string;
  lastSeen: string;
}

interface DeleteDeviceModalProps {
  device: Device;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDeviceModal: React.FC<DeleteDeviceModalProps> = ({
  device,
  onClose,
  onConfirm
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Delete Device</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Are you sure you want to delete this device?</p>
              <p className="text-gray-600 mt-1">
                This will permanently remove "{device.name}" from {device.branch}.
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="font-medium text-gray-900 mb-2">Device Information:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Name: {device.name}</p>
              <p>Token: {device.token}</p>
              <p>Branch: {device.branch}</p>
              <p>Status: {device.status}</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Device
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDeviceModal;