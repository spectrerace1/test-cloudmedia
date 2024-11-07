// services/api/branchGroup.service.ts
import axios from './axios'; // axios ayarlarını içeren dosyanız

export const branchGroupService = {
  async createGroup(data: any) {
    return axios.post('/branch-groups', data);
  },

  async getGroups() {
    return axios.get('/branch-groups');
  },

  async updateGroup(id: string, data: any) {
    return axios.patch(`/branch-groups/${id}`, data);
  },

  async deleteGroup(id: string) {
    return axios.delete(`/branch-groups/${id}`);
  },
};
