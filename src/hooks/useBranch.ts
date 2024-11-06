import { useState, useEffect } from 'react';
import { branchService } from '../services/api';
import { Branch } from '../types/branch';

export const useBranch = (branchId?: string) => {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (branchId) {
      loadBranch(branchId);
    } else {
      loadBranches();
    }
  }, [branchId]);

  const loadBranch = async (id: string) => {
    try {
      setLoading(true);
      const data = await branchService.getBranch(id);
      setBranch(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load branch');
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await branchService.getAllBranches();
      setBranches(data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  // userId'yi branchData'ya dahil edecek şekilde güncellendi
  const createBranch = async (branchData: Partial<Branch & { userId: string }>) => {
    console.log("Branch data being sent:", branchData); // branchData içeriğini kontrol edin
    try {
      const newBranch = await branchService.createBranch(branchData);
      setBranches([...branches, newBranch]);
      return newBranch;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create branch');
    }
  };


  const updateBranch = async (id: string, branchData: Partial<Branch>) => {
    try {
      const updatedBranch = await branchService.updateBranch(id, branchData);
      setBranches(branches.map(b => b.id === id ? updatedBranch : b));
      if (branch?.id === id) {
        setBranch(updatedBranch);
      }
      return updatedBranch;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update branch');
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await branchService.deleteBranch(id);
      setBranches(branches.filter(b => b.id !== id));
      if (branch?.id === id) {
        setBranch(null);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete branch');
    }
  };

  const updateBranchSettings = async (id: string, settings: any) => {
    try {
      const updatedBranch = await branchService.updateBranchSettings(id, settings);
      setBranches(branches.map(b => b.id === id ? updatedBranch : b));
      if (branch?.id === id) {
        setBranch(updatedBranch);
      }
      return updatedBranch;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update branch settings');
    }
  };

  return {
    branch,
    branches,
    loading,
    error,
    createBranch,
    updateBranch,
    deleteBranch,
    updateBranchSettings,
    refresh: branchId ? () => loadBranch(branchId) : loadBranches
  };
};
