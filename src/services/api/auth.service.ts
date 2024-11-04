import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  },

  async register(userData: RegisterData) {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token);
    return data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/auth/logout');
    }
    localStorage.removeItem('token');
    return true;
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async refreshToken() {
    const { data } = await api.post('/auth/refresh');
    localStorage.setItem('token', data.token);
    return data;
  }
};