import React, { useState } from 'react';
import { Signal, SignalZero, Play, Pause, Volume2, Edit, Trash2, Search, Plus, Filter, SortAsc, MapPin } from 'lucide-react';
import AddBranchModal from './AddBranchModal';
import EditBranchModal from './EditBranchModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Branch {
  id: number;
  name: string;
  devices: number;
  playlist: string;
  status: 'online' | 'offline';
  ip: string;
  hasAnnouncement: boolean;
}

const initialBranches: Branch[] = [
  {
    id: 1,
    name: 'Downtown Branch',
    devices: 3,
    playlist: 'Summer Hits 2024',
    status: 'online',
    ip: '192.168.1.101',
    hasAnnouncement: true
  },
  {
    id: 2,
    name: 'Mall Location',
    devices: 2,
    playlist: 'Relaxing Jazz',
    status: 'online',
    ip: '192.168.1.102',
    hasAnnouncement: false
  },
  {
    id: 3,
    name: 'Airport Store',
    devices: 1,
    playlist: 'Pop Classics',
    status: 'offline',
    ip: '192.168.1.103',
    hasAnnouncement: false
  }
];

const ViewAllBranches: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleAddBranch = (branchData: any) => {
    const newBranch: Branch = {
      id: branches.length + 1,
      name: branchData.name,
      devices: 0,
      playlist: '',
      status: 'online',
      ip: branchData.ipAddress,
      hasAnnouncement: false
    };
    setBranches([...branches, newBranch]);
  };

  const handleEditBranch = (branchData: any) => {
    setBranches(prev => prev.map(branch => 
      branch.id === selectedBranch?.id ? { ...branch, ...branchData } : branch
    ));
  };

  const handleDeleteBranch = () => {
    setBranches(prev => prev.filter(branch => branch.id !== selectedBranch?.id));
  };

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.ip.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Branches</h2>
          <p className="text-gray-600 mt-1">Manage and monitor your branch locations</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Branch
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'all'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('online')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'online'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Online
            </button>
            <button
              onClick={() => setStatusFilter('offline')}
              className={`px-4 py-2 rounded-lg ${
                statusFilter === 'offline'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Offline
            </button>
          </div>
        </div>
      </div>

      {/* Branch List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Branch</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Devices</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Current Playlist</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-600 font-medium">IP Address</th>
                <th className="text-right px-6 py-4 text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((branch) => (
                <tr key={branch.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{branch.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {branch.devices} devices
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4 text-green-600" />
                      <span className="text-gray-900">{branch.playlist || 'No playlist'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {branch.status === 'online' ? (
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
                    <span className="text-gray-600">{branch.ip}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {branch.hasAnnouncement && (
                        <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600">
                        {branch.status === 'online' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedBranch(branch);
                          setShowEditModal(true);
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedBranch(branch);
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
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddBranchModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddBranch}
        />
      )}

      {showEditModal && selectedBranch && (
        <EditBranchModal
          branch={selectedBranch}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBranch(null);
          }}
          onSave={handleEditBranch}
        />
      )}

      {showDeleteModal && selectedBranch && (
        <DeleteConfirmModal
          branchName={selectedBranch.name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBranch(null);
          }}
          onConfirm={handleDeleteBranch}
        />
      )}
    </div>
  );
};

export default ViewAllBranches;