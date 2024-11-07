// hooks/useBranchGroup.ts
import { useState, useEffect } from 'react';
import { branchGroupService } from '../services/api/branchGroup.service';

export function useBranchGroup() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await branchGroupService.getGroups();
      setGroups(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (data: any) => {
    try {
      const response = await branchGroupService.createGroup(data);
      setGroups([...groups, response.data]);
    } catch (err) {
      setError(err);
    }
  };

  const updateGroup = async (id: string, data: any) => {
    try {
      await branchGroupService.updateGroup(id, data);
      fetchGroups(); // Verileri yeniden yükleyerek güncellenmiş hali alır
    } catch (err) {
      setError(err);
    }
  };

  const deleteGroup = async (id: string) => {
    try {
      await branchGroupService.deleteGroup(id);
      fetchGroups(); // Verileri yeniden yükleyerek güncellenmiş hali alır
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    error,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}
