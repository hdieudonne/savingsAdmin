import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin Auth APIs
export const adminAuthAPI = {
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile')
};

// User Management APIs
export const userAPI = {
  getAllUsers: (page = 1, limit = 20, search = '') => 
    api.get(`/users?page=${page}&limit=${limit}&search=${search}`),
  getUserById: (userId) => api.get(`/users/${userId}`),
  toggleUserStatus: (userId) => api.put(`/users/${userId}/toggle-status`)
};

// Device Management APIs
export const deviceAPI = {
  getPendingVerifications: () => api.get('/devices/pending'),
  verifyDevice: (userId, deviceId) => api.post('/devices/verify', { userId, deviceId }),
  revokeDevice: (userId, deviceId) => api.post('/devices/revoke', { userId, deviceId })
};

// Dashboard APIs
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAllTransactions: (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    return api.get(`/transactions?${params}`);
  }
};

export default api;