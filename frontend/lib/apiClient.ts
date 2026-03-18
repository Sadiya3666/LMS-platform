import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 
           'http://localhost:4000',
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    // Don't retry if the request is already a refresh attempt or not a 401
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/api/auth/refresh')) {
      original._retry = true;
      try {
        // Use a direct axios call or local instance for refresh to avoid global interceptor loop
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}/api/auth/refresh`, {}, { withCredentials: true });
        const newToken = res.data.accessToken;
        useAuthStore.getState().setToken(newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
