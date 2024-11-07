import React, { useState } from 'react';
import { 
  X, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Monitor,
  Info,
  HardDrive,
  Network,
  Clock,
  Activity,
  BarChart2,
  Link2,
  AlertTriangle
} from 'lucide-react';

interface DeviceConnectionModalProps {
  device: {
    id: string;
    name: string;
    status: {
      ip: string;
      online: boolean;
      version: string;
      lastSeen: string;
      systemInfo: {
        os: string;
        memory: number;
        storage: number;
      };
    };
    branch: {
      id: string;
      name: string;
      location: string;
      settings: {
        volume: number;
        timezone: string;
        operatingHours: {
          start: string;
          end: string;
        };
      };
    };
  };
  onClose: () => void;
  onUpdateStatus: (status: 'online' | 'offline') => void;
}

const DeviceConnectionModal: React.FC<DeviceConnectionModalProps> = ({
  device,
  onClose,
  onUpdateStatus
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'performance' | 'connection'>('info');
  const [isReconnecting, setIsReconnecting] = useState(false);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsReconnecting(false);
    onUpdateStatus('online');
  };

  const renderInfoTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* System Information */}
        <div className="col-span-2 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-4">System Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Monitor className="w-4 h-4" />
                <span>Operating System:</span>
                <span className="font-medium text-gray-900">{device.status.systemInfo.os || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Info className="w-4 h-4" />
                <span>Device Version:</span>
                <span className="font-medium text-gray-900">{device.status.version}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <HardDrive className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">Storage</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Storage:</span>
              <span className="font-medium text-gray-900">{device.status.systemInfo.storage} GB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Memory:</span>
              <span className="font-medium text-gray-900">{device.status.systemInfo.memory} MB</span>
            </div>
          </div>
        </div>

        {/* Branch Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">Branch Information</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Branch Name:</span>
              <span className="font-medium text-gray-900">{device.branch.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium text-gray-900">{device.branch.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnectionTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <Network className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-700">Connection Status</h3>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${device.status.online ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {device.status.online ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Last Connected:</span>
            <span className="font-medium text-gray-900">{new Date(device.status.lastSeen).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IP Address:</span>
            <span className="font-medium text-gray-900">{device.status.ip || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Connection Actions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Connection Actions</h3>
        <button
          onClick={handleReconnect}
          disabled={isReconnecting || device.status.online}
          className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
          {isReconnecting ? 'Reconnecting...' : 'Reconnect Device'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${device.status.online ? 'bg-green-100' : 'bg-red-100'}`}>
                {device.status.online ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-600" />}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{device.name}</h2>
                <p className="text-sm text-gray-500">Last seen: {new Date(device.status.lastSeen).toLocaleString()}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 p-6 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'info' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            System Info
          </button>
          <button
            onClick={() => setActiveTab('connection')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'connection' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Connection
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'connection' && renderConnectionTab()}
        </div>
      </div>
    </div>
  );
};

export default DeviceConnectionModal;
