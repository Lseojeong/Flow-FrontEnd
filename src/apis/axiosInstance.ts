import axios from 'axios';
import { ENV } from '@/apis/env';

export const axiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
  responseType: 'json',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
