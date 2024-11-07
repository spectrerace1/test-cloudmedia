import React, { useState, useEffect } from 'react';
import { FolderPlus, Volume2, Play, Pause, Edit, Trash2 } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';
import EditGroupModal from './EditGroupModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { useBranchGroup } from '../../hooks/useBranchGroup';

interface BranchGroup {
  id: number;
  name: string;
  branchCount: number;
  playlist: string;
  lastUpdated: string;
  status: 'playing' | 'paused';
  hasAnnouncement: boolean;
}

const BranchGroups: React.FC = () => {
  const { groups, loading, error, createGroup, updateGroup, deleteGroup, toggleGroupStatus } = useBranchGroup();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<BranchGroup | null>(null);

  const handleCreateGroup = async (groupData: any) => {
    await createGroup(groupData);
    setShowCreateModal(false);
  };

  const handleEditGroup = async (groupData: any) => {
    if (selectedGroup) {
      await updateGroup(selectedGroup.id, groupData);
      setShowEditModal(false);
      setSelectedGroup(null);
    }
  };

  const handleDeleteGroup = async () => {
    if (selectedGroup) {
      await deleteGroup(selectedGroup.id);
      setShowDeleteModal(false);
      setSelectedGroup(null);
    }
  };

  const handleToggleStatus = async (group: BranchGroup) => {
    await toggleGroupStatus(group.id, group.status === 'playing' ? 'paused' : 'playing');
  };
  {console.log(selectedGroup)}
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-2">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Branch Groups</h2>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create New Group
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Group</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Branches</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Current Playlist</th>
              <th className="text-left px-6 py-4 text-gray-600 font-medium">Last Updated</th>
              <th className="text-right px-6 py-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {groups.map((group) => (
              <tr key={group.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{group.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {group.branchCount} branches
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-green-600" />
                    <span className="text-gray-900">{group.playlist}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-600">{group.lastUpdated}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {group.hasAnnouncement && (
                      <button 
                        onClick={() => console.log('Play announcement for group:', group.name)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-50 hover:bg-yellow-100 text-yellow-600"
                        title="Play Announcement"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleToggleStatus(group)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600"
                      title={group.status === 'playing' ? 'Pause Group' : 'Play Group'}
                    >
                      {group.status === 'playing' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowEditModal(true);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
                      title="Edit Group"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowDeleteModal(true);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                      title="Delete Group"
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

      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onAdd={handleCreateGroup}
        />
      )}

      {showEditModal && selectedGroup && (
        <EditGroupModal
          group={selectedGroup}
          onClose={() => {
            setShowEditModal(false);
            setSelectedGroup(null);
          }}
          onSave={handleEditGroup}
        />
      )}

      {showDeleteModal && selectedGroup && (
        <DeleteConfirmModal
          branchName={selectedGroup.name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedGroup(null);
          }}
          onConfirm={handleDeleteGroup}
        />
      )}
    </div>
  );
};

export default BranchGroups;
