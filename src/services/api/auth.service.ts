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
    localStorage.setItem('token', data.token); // Token'ı localStorage'a kaydedin
    localStorage.setItem('user', JSON.stringify(data.user)); // Kullanıcı bilgilerini kaydedin
    return data;
  },

  async register(userData: RegisterData) {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.token); // Token'ı localStorage'a kaydedin
    localStorage.setItem('user', JSON.stringify(data.user)); // Kullanıcı bilgilerini kaydedin
    return data;
  },

  async logout() {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/auth/logout');
    }
    localStorage.removeItem('token'); // Token'ı kaldırın
    localStorage.removeItem('user'); // Kullanıcı bilgilerini kaldırın
    return true;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (token) {
      const { data } = await api.get('/auth/me');
      return data;
    } else {
      // Eğer token yoksa, localStorage'dan kullanıcı bilgilerini al
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  },

  async refreshToken() {
    const { data } = await api.post('/auth/refresh');
    localStorage.setItem('token', data.token); // Yeni token'ı kaydedin
    return data;
  }
};
