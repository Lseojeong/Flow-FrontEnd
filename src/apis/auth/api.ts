import { axiosInstance } from '@/apis/axiosInstance';

// 관리자 회원가입
export const postAdminSignup = async (data: {
  name: string;
  adminId: string;
  password: string;
  passwordCheck: string;
  invitationToken: string;
}) => {
  const res = await axiosInstance.post('/admin/signup', data);
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
export const postAdminLogin = async (data: { adminId: string; password: string }) => {
  const res = await axiosInstance.post('/admin/login', data);
  const { accessToken, csrfToken } = res.data.result;

  localStorage.setItem('csrfToken', csrfToken);

  return res.data.result;
};

// 토큰 갱신
export const refreshToken = async () => {
  const res = await axiosInstance.post('/admin/refresh');
  return res.data.result;
};

// 로그아웃
export const postLogout = async () => {
  const res = await axiosInstance.post('/admin/logout');

  localStorage.removeItem('csrfToken');

  return res.data;
};

// 관리자 프로필 조회
export const getAdminProfile = async () => {
  const res = await axiosInstance.get('/admin/profile');
  return res.data.result;
};
