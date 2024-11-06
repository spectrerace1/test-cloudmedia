import React, { useState } from 'react';
import { useDevice } from '../../hooks/useDevice';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Device } from '../../types/device';
import { Signal, SignalZero, Laptop2, Download, Link, Edit, Trash2, Search, Filter } from 'lucide-react';
import DeviceConnectionModal from './DeviceConnectionModal';
import AddDevice from './AddDevice';
import EditDevice from './EditDevice';
import DeleteDeviceModal from './DeleteDeviceModal';

const DeviceList: React.FC = () => {
  const { devices, loading, error, registerDevice, updateDevice, deleteDevice, updateDeviceStatus, refresh } = useDevice();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  // WebSocket bağlantısını her zaman başlat, ancak yalnızca `selectedDevice` varsa kullan
  const ws = useWebSocket(selectedDevice?.id);

  const handleAddDevice = async (branchId: string, deviceData: Partial<Device>) => {
    try {
      await registerDevice(branchId, deviceData);
      setShowAddModal(false);
      refresh();
    } catch (error) {
      console.error('Failed to register device:', error);
    }
  };

  const handleEditDevice = async (updatedData: Partial<Device>) => {
    if (!selectedDevice) return;
    try {
      // Sadece name ve branchId gönderiliyor
      await updateDevice(selectedDevice.id, {
        name: updatedData.name,
        branchId: updatedData.branchId,
      });
      setShowEditModal(false);
      setSelectedDevice(null);
      refresh();
    } catch (error) {
      console.error('Failed to update device:', error);
    }
  };


  const handleDeleteDevice = async () => {
    if (!selectedDevice) return;
    try {
      await deleteDevice(selectedDevice.id);
      setShowDeleteModal(false);
      setSelectedDevice(null);
      refresh();
    } catch (error) {
      console.error('Failed to delete device:', error);
    }
  };

  const handleStatusUpdate = async (deviceId: string, status: any) => {
    try {
      await updateDeviceStatus(deviceId, status);
      refresh();
    } catch (error) {
      console.error('Failed to update device status:', error);
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.branch.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'online' && device.status.online) ||
      (statusFilter === 'offline' && !device.status.online);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Devices</h2>
            <p className="text-gray-600 mt-1">Manage your connected devices and players</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.open('https://example.com/download-player', '_blank')}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Player
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Laptop2 className="w-4 h-4 mr-2" />
              Add Device
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'all'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('online')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'online'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Online
            </button>
            <button
              onClick={() => setStatusFilter('offline')}
              className={`px-4 py-2 rounded-lg ${statusFilter === 'offline'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Offline
            </button>
          </div>
        </div>
      </div>

      {/* Device List */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Device</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Token</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">IP Address</th>
              <th className="text-right px-6 py-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{device.name}</span>
                    <span className="text-sm text-gray-500">{device?.systemInfo?.os || 'Unknown'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {device?.token}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{device?.branch?.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {device?.status?.online ? (
                      <>
                        <Signal className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Online</span>
                      </>
                    ) : (
                      <>
                        <SignalZero className="w-4 h-4 text-red-600" />
                        <span className="text-red-600">Offline</span>
                      </>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{device?.status?.ip || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedDevice(device);
                        setShowConnectionModal(true);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDevice(device);
                        setShowEditModal(true);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDevice(device);
                        setShowDeleteModal(true);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showConnectionModal && selectedDevice && (
        <DeviceConnectionModal
          device={selectedDevice}
          onClose={() => {
            setShowConnectionModal(false);
            setSelectedDevice(null);
          }}
          onUpdateStatus={handleStatusUpdate}
          wsConnection={ws}
        />
      )}

      {showAddModal && (
        <AddDevice
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddDevice}
        />
      )}

      {showEditModal && selectedDevice && (
        <EditDevice
          device={selectedDevice}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDevice(null);
          }}
          onSave={handleEditDevice}
        />
      )}

      {showDeleteModal && selectedDevice && (
        <DeleteDeviceModal
          device={selectedDevice}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedDevice(null);
          }}
          onConfirm={handleDeleteDevice}
        />
      )}
    </div>
  );
};

export default DeviceList;
