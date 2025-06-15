import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
    _retry?: boolean;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && 
        originalRequest?.url !== '/refresh-token' &&
        !originalRequest?._retry) {
      
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshToken();
        localStorage.setItem('token', newToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api.request(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const refreshToken = async (): Promise<string> => {
  try {
    const response = await axios.post<{ token: string }>(
      `${import.meta.env.VITE_API_BASE_URL}/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!response.data.token) {
      throw new Error('No token returned');
    }
    
    return response.data.token;
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

export default api;