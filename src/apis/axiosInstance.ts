import axios, { AxiosResponse } from 'axios';
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

function transformEnums(obj: unknown): void {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    Object.entries(obj).forEach(([key, value]) => {
      if (
        value &&
        typeof value === 'object' &&
        'name' in value &&
        typeof (value as { name: unknown }).name === 'string'
      ) {
        (obj as Record<string, unknown>)[key] = (value as { name: string }).name;
      } else if (value && typeof value === 'object') {
        transformEnums(value);
      }
    });
  } else if (Array.isArray(obj)) {
    obj.forEach((item) => transformEnums(item));
  }
}

axiosInstance.interceptors.response.use(
  <T>(response: AxiosResponse<T>): AxiosResponse<T> => {
    if (response.data && typeof response.data === 'object' && 'result' in response.data) {
      transformEnums((response.data as { result: unknown }).result);
    }
    return response;
  },
  (error) => Promise.reject(error)
);
