import { axiosInstance } from '@/apis/axiosInstance';
import {
  UserSettingResponse,
  ChangeAdminDepartmentRequest,
  ChangeAdminDepartmentResponse,
  DepartmentListResponse,
  InviteAdminRequest,
  InviteAdminResponse,
  DeleteAdminResponse,
} from './types';

export const getUserSetting = async (): Promise<UserSettingResponse> => {
  const res = await axiosInstance.get('/admin/org/setting');
  return res.data;
};

export const getDepartmentList = async (): Promise<DepartmentListResponse> => {
  const res = await axiosInstance.get('/admin/org/invite');
  return res.data;
};

export const changeAdminDepartment = async (
  data: ChangeAdminDepartmentRequest
): Promise<ChangeAdminDepartmentResponse> => {
  const res = await axiosInstance.put('/admin/org/depart/change', data);
  return res.data;
};

export const inviteAdmin = async (data: InviteAdminRequest[]): Promise<InviteAdminResponse> => {
  const res = await axiosInstance.post('/admin/org/invite', data);
  return res.data;
};

export const deleteAdmin = async (adminPKId: string): Promise<DeleteAdminResponse> => {
  const res = await axiosInstance.delete(`/admin/signout/${adminPKId}`);
  return res.data;
};
