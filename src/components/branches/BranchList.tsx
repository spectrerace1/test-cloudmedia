import React, { useState } from 'react';
import { useBranch } from '../../hooks/useBranch';
import { usePlaylist } from '../../hooks/usePlaylist';
import { Branch } from '../../types/branch';
import { Signal, SignalZero, Play, Pause, Volume2, Edit, Trash2 } from 'lucide-react';
import AddBranchModal from './AddBranchModal';
import EditBranchModal from './EditBranchModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { useAuth } from '../../hooks/useAuth';
const BranchList: React.FC = () => {
  const { user } = useAuth();
  const { branches, loading, error, createBranch, updateBranch, deleteBranch, refresh } = useBranch();
  const { playlists } = usePlaylist();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const handleAddBranch = async (branchData: Partial<Branch>) => {
    console.log("6544654",user)
    if (!user) {
      console.error('Kullanıcı oturum açmamış.');
      return;
    }
  
    console.log("Oturum açmış kullanıcı ID'si:", user.id); // user.id'nin mevcut olduğunu kontrol edin
  
    try {
      // `userId`yi `branchData`'ya ekleyin
      const completeBranchData = { ...branchData, userId: user.id };
      console.log("Tam branch data:", completeBranchData); // completeBranchData içeriğini kontrol edin
      await createBranch(completeBranchData); // `createBranch`'e `userId` ile gönderin
      setShowAddModal(false);
      refresh();
    } catch (error) {
      console.error('Failed to create branch:', error);
    }
  };
  
  const handleEditBranch = async (branchData: Partial<Branch>) => {
    if (!selectedBranch) return;
    try {
      await updateBranch(selectedBranch.id, branchData);
      setShowEditModal(false);
      setSelectedBranch(null);
      refresh();
    } catch (error) {
      console.error('Failed to update branch:', error);
    }
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;
    try {
      await deleteBranch(selectedBranch.id);
      setShowDeleteModal(false);
      setSelectedBranch(null);
      refresh();
    } catch (error) {
      console.error('Failed to delete branch:', error);
    }
  };

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
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Branch List</h2>
            <p className="text-gray-600 mt-1">Manage your branches and their settings</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add New Branch
          </button>
        </div>
      </div>
      
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
            {branches.map((branch) => (
              <tr key={branch.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{branch.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {branch.devices.length} devices
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
                    {branch.devices.some(device => device.status.online) ? (
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
                  <span className="text-gray-600">
                    {branch.devices[0]?.status.ip || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {branch.hasAnnouncement && (
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600">
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
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

      {showAddModal && (
        <AddBranchModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddBranch}
          playlists={playlists}
          userId={user?.id}
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
          playlists={playlists}
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

export default BranchList;