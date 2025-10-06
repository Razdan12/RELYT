
import { listed } from '@/constant/listed';
import useAuthStore from '@/store/auth.store';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_URL,
  timeout: 10000,

});

// Helpful debug: print resolved baseURL in dev so the network target is obvious when requests 404
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.debug("apiClient baseURL:", apiClient.defaults.baseURL);
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 400 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshToken();
        const newToken = useAuthStore.getState().token;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest); 
        }
      } catch (refreshError) {
        console.error('Refresh token failed, logging out...');
        useAuthStore.getState().logout();
        window.location.href = listed.login; 
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;