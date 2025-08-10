import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
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

// 요청 인터셉터: CSRF 토큰 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem('csrfToken');
    if (csrfToken) {
      config.headers = applyHeader(config.headers, 'X-CSRF-Token', csrfToken);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// refresh 전용 axios (인터셉터 비적용, 순수 호출용)
const refreshAxios = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 5000,
  responseType: 'json',
});

// 헤더 설정 유틸 (Axios v1의 AxiosHeaders | 객체 모두 지원)
function applyHeader(
  headers: InternalAxiosRequestConfig['headers'] | unknown,
  key: string,
  value: string
): InternalAxiosRequestConfig['headers'] {
  if (
    headers &&
    typeof headers === 'object' &&
    'set' in headers &&
    typeof (headers as { set: (_k: string, _v: string) => void }).set === 'function'
  ) {
    (headers as { set: (_k: string, _v: string) => void }).set(key, value);
    return headers as InternalAxiosRequestConfig['headers'];
  }

  const base = (headers && typeof headers === 'object' ? headers : {}) as Record<string, unknown>;
  const merged = { ...base, [key]: value } as Record<string, string>;
  return merged as unknown as InternalAxiosRequestConfig['headers'];
}

// 응답 인터셉터: 401 처리 → refresh → 원 요청 재시도
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await refreshAxios.post('/admin/refresh');
        const newCsrfToken: string | undefined = res.data?.result?.csrfToken;

        if (newCsrfToken) {
          localStorage.setItem('csrfToken', newCsrfToken);

          // 원 요청 헤더 갱신 후 재시도 (defaults는 요청 인터셉터에서 LocalStorage로 커버)
          originalRequest.headers = applyHeader(
            originalRequest.headers,
            'X-CSRF-Token',
            newCsrfToken
          );

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
