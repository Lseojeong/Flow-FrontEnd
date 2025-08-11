import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ENV } from '@/apis/env';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    _skipAuthRefresh?: boolean;
  }
}

const AUTH_EXCLUDED_PATHS = [
  '/admin/login',
  '/admin/signup',
  '/admin/signup/check-id',
  '/admin/signup/token',
  '/admin/refresh',
  '/admin/logout',
] as const;

const isAuthExcluded = (url?: string) => {
  if (!url) return false;
  return AUTH_EXCLUDED_PATHS.some((path) => url.startsWith(path));
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000,
  responseType: 'json',
});

const refreshAxios: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000,
});

const getCsrfToken = () => localStorage.getItem('csrfToken');
const setCsrfToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem('csrfToken');
  } else {
    localStorage.setItem('csrfToken', token);
  }
};

axiosInstance.interceptors.request.use((config) => {
  const csrf = getCsrfToken();
  if (csrf) {
    config.headers.set?.('X-CSRF-Token', csrf);
  }
  return config;
});

let isRefreshing = false;
let pendingQueue: {
  resolve: (_value?: unknown) => void;
  reject: (_reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
      return;
    }
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['X-CSRF-Token'] = token;
    }
    resolve(axiosInstance(config));
  });
  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as InternalAxiosRequestConfig | undefined;

    const status = error.response?.status;
    if (!originalConfig || originalConfig._retry || status !== 401) {
      return Promise.reject(error);
    }

    if (isAuthExcluded(originalConfig.url)) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    isRefreshing = true;

    try {
      const refreshRes = await refreshAxios.post<{
        code: string;
        message: string;
        result: { accessToken?: string; csrfToken: string };
      }>('/admin/refresh');

      const newCsrf = refreshRes.data?.result?.csrfToken;
      if (!newCsrf) {
        throw new Error('No csrfToken on refresh response');
      }

      setCsrfToken(newCsrf);

      processQueue(null, newCsrf);

      originalConfig.headers = originalConfig.headers ?? {};
      (originalConfig.headers as Record<string, string>)['X-CSRF-Token'] = newCsrf;

      return axiosInstance(originalConfig);
    } catch (refreshErr) {
      console.error('Token refresh failed:', refreshErr);
      processQueue(refreshErr, null);
      setCsrfToken(null);

      if (typeof window !== 'undefined') {
        if (!window.location.pathname.includes('/')) {
          window.location.href = '/';
        }
      }

      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
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
