import React, { useState } from 'react';
import { 
  X, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Monitor,
  Info,
  HardDrive,
  Cpu,
  CircuitBoard,
  Network,
  Clock,
  Activity,
  Thermometer,
  BarChart2,
  Link2,
  AlertTriangle
} from 'lucide-react';

interface DeviceConnectionModalProps {
  device: {
    id: string;
    name: string;
    status: 'online' | 'offline';
    ip: string;
    lastSeen: string;
    systemInfo: {
      os: string;
      playerVersion: string;
      playerType: string;
      deviceId: string;
      macAddress: string;
      diskSpace: {
        total: string;
        used: string;
        free: string;
      };
    };
    performance: {
      cpuUsage: number;
      memoryUsage: number;
      temperature: number;
      networkSpeed: {
        download: string;
        upload: string;
      };
      uptime: string;
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
  const [isResetting, setIsResetting] = useState(false);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    // Simulate reconnection attempt
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsReconnecting(false);
    onUpdateStatus('online');
  };

  const handleResetConnection = async () => {
    setIsResetting(true);
    // Simulate connection reset
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsResetting(false);
    // In a real app, this would trigger a device reauthorization
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
                <span className="font-medium text-gray-900">{device.systemInfo.os}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Info className="w-4 h-4" />
                <span>Player Version:</span>
                <span className="font-medium text-gray-900">{device.systemInfo.playerVersion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CircuitBoard className="w-4 h-4" />
                <span>Player Type:</span>
                <span className="font-medium text-gray-900">{device.systemInfo.playerType}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Network className="w-4 h-4" />
                <span>MAC Address:</span>
                <span className="font-medium text-gray-900">{device.systemInfo.macAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Info className="w-4 h-4" />
                <span>Device ID:</span>
                <span className="font-medium text-gray-900">{device.systemInfo.deviceId}</span>
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
              <span className="text-gray-600">Total Space:</span>
              <span className="font-medium text-gray-900">{device.systemInfo.diskSpace.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used Space:</span>
              <span className="font-medium text-gray-900">{device.systemInfo.diskSpace.used}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Free Space:</span>
              <span className="font-medium text-gray-900">{device.systemInfo.diskSpace.free}</span>
            </div>
          </div>
        </div>

        {/* Network Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">Network</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Download Speed:</span>
              <span className="font-medium text-gray-900">{device.performance.networkSpeed.download}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Upload Speed:</span>
              <span className="font-medium text-gray-900">{device.performance.networkSpeed.upload}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IP Address:</span>
              <span className="font-medium text-gray-900">{device.ip}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* CPU Usage */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">CPU Usage</span>
            </div>
            <span className="text-lg font-medium text-gray-900">{device.performance.cpuUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${device.performance.cpuUsage}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CircuitBoard className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Memory Usage</span>
            </div>
            <span className="text-lg font-medium text-gray-900">{device.performance.memoryUsage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${device.performance.memoryUsage}%` }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Temperature</span>
            </div>
            <span className="text-lg font-medium text-gray-900">{device.performance.temperature}°C</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                device.performance.temperature > 80 
                  ? 'bg-red-600' 
                  : device.performance.temperature > 60 
                    ? 'bg-yellow-600' 
                    : 'bg-green-600'
              }`}
              style={{ width: `${(device.performance.temperature / 100) * 100}%` }}
            />
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Uptime</span>
            </div>
            <span className="text-lg font-medium text-gray-900">{device.performance.uptime}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnectionTab = () => (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-700">Connection Status</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
            device.status === 'online' 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {device.status === 'online' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Last Connected:</span>
            <span className="font-medium text-gray-900">{device.lastSeen}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">IP Address:</span>
            <span className="font-medium text-gray-900">{device.ip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">MAC Address:</span>
            <span className="font-medium text-gray-900">{device.systemInfo.macAddress}</span>
          </div>
        </div>
      </div>

      {/* Connection Actions */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Connection Actions</h3>
        <div className="space-y-4">
          <button
            onClick={handleReconnect}
            disabled={isReconnecting || device.status === 'online'}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
            {isReconnecting ? 'Reconnecting...' : 'Reconnect Device'}
          </button>
          
          <button
            onClick={handleResetConnection}
            disabled={isResetting}
            className="w-full flex items-center justify-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Link2 className={`w-4 h-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? 'Resetting...' : 'Reset Connection'}
          </button>
        </div>
      </div>

      {/* Connection Warning */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Connection Management</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Resetting the connection will require the device to be reauthorized using a new token.
              Make sure to have physical access to the device before proceeding.
            </p>
          </div>
        </div>
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
              <div className={`p-2 rounded-lg ${
                device.status === 'online' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {device.status === 'online' ? (
                  <Wifi className="w-5 h-5 text-green-600" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{device.name}</h2>
                <p className="text-sm text-gray-500">Last seen: {device.lastSeen}</p>
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
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'info'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            System Info
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'performance'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('connection')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'connection'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Connection
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'connection' && renderConnectionTab()}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Status:</span>
            <span className={`text-sm font-medium ${
              device.status === 'online' ? 'text-green-600' : 'text-red-600'
            }`}>
              {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
            </span>
          </div>
          {device.status === 'offline' && (
            <button
              onClick={handleReconnect}
              disabled={isReconnecting}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isReconnecting ? 'animate-spin' : ''}`} />
              {isReconnecting ? 'Reconnecting...' : 'Reconnect'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceConnectionModal;