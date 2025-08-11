import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiResponse,
  AdminSignupRequest,
  LoginRequest,
  CsrfTokenResult,
  AdminProfile,
} from './types';

export const postAdminSignup = async (data: AdminSignupRequest) => {
  const res = await axiosInstance.post<ApiResponse<unknown>>('/admin/signup', data);
  return res.data;
};

export const checkAdminIdExists = async (id: string) => {
  const res = await axiosInstance.get<ApiResponse<{ exists: boolean }>>(
    `/admin/signup/check-id/${id}`
  );
  return res.data.result.exists;
};

export const verifyInvitationToken = async (invitationToken: string) => {
  const res = await axiosInstance.post<ApiResponse<unknown>>('/admin/signup/token', {
    invitationToken,
  });
  return res.data;
};

export const postAdminLogin = async (data: LoginRequest) => {
  const res = await axiosInstance.post<ApiResponse<CsrfTokenResult>>('/admin/login', data);
  const { csrfToken } = res.data.result;
  localStorage.setItem('csrfToken', csrfToken);
  return res.data.result;
};

export const postLogout = async () => {
  // 로그아웃은 빠르게 처리하도록 짧은 타임아웃 설정
  const res = await axiosInstance.post<ApiResponse<unknown>>(
    '/admin/logout',
    {},
    {
      timeout: 3000, // 3초 타임아웃
    }
  );
  localStorage.removeItem('csrfToken');
  return res.data;
};

export const getAdminProfile = async (): Promise<AdminProfile> => {
  const res = await axiosInstance.get<ApiResponse<AdminProfile>>('/admin/profile');
  return res.data.result;
};
