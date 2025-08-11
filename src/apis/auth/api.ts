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

export const verifyInvitationToken = async (token: string) => {
  const response = await axiosInstance.post<ApiResponse<unknown>>('/admin/signup/token', {
    invitationToken: token,
  });
  return response.data;
};

export const postAdminLogin = async (data: LoginRequest) => {
  const res = await axiosInstance.post<ApiResponse<CsrfTokenResult>>('/admin/login', data);
  const { csrfToken } = res.data.result;
  localStorage.setItem('csrfToken', csrfToken);
  return res.data.result;
};

export const postLogout = async () => {
  const res = await axiosInstance.post<ApiResponse<unknown>>(
    '/admin/logout',
    {},
    {
      timeout: 3000,
    }
  );
  localStorage.removeItem('csrfToken');
  return res.data;
};

export const getAdminProfile = async (): Promise<AdminProfile> => {
  const res = await axiosInstance.get<ApiResponse<AdminProfile>>('/admin/profile');
  return res.data.result;
};
