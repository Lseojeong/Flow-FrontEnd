import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiResponse,
  AdminSignupRequest,
  LoginRequest,
  CsrfTokenResult,
  AdminProfile,
} from './types';

// 관리자 회원가입
export const postAdminSignup = async (data: AdminSignupRequest) => {
  const res = await axiosInstance.post<ApiResponse<unknown>>('/admin/signup', data);
  return res.data;
};

// ID 중복 확인
export const checkAdminIdExists = async (id: string) => {
  const res = await axiosInstance.get(`/admin/signup/check-id/${id}`);
  return res.data.result.exists;
};

// 초대 토큰 검증
export const verifyInvitationToken = async (invitationToken: string) => {
  const res = await axiosInstance.post('/admin/signup/token', { invitationToken });
  return res.data;
};

// 로그인
export const postAdminLogin = async (data: LoginRequest) => {
  const res = await axiosInstance.post<ApiResponse<CsrfTokenResult>>('/admin/login', data);
  const { csrfToken } = res.data.result;
  localStorage.setItem('csrfToken', csrfToken);
  return res.data.result;
};

// 토큰 갱신
export const refreshToken = async (): Promise<CsrfTokenResult> => {
  const res = await axiosInstance.post<ApiResponse<CsrfTokenResult>>('/admin/refresh');
  return res.data.result;
};

// 로그아웃
export const postLogout = async (): Promise<ApiResponse<unknown>> => {
  const res = await axiosInstance.post<ApiResponse<unknown>>('/admin/logout');
  localStorage.removeItem('csrfToken');
  return res.data;
};

// 관리자 프로필 조회
export const getAdminProfile = async (): Promise<AdminProfile> => {
  const res = await axiosInstance.get<ApiResponse<AdminProfile>>('/admin/profile');
  return res.data.result;
};
