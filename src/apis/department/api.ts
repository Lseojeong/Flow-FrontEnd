import { axiosInstance } from '@/apis/axiosInstance';
import {
  DepartmentListResponse,
  DepartmentSettingListResponse,
  CreateDepartmentsRequest,
  CreateDepartmentsResponse,
  UpdateDepartmentRequest,
  UpdateDepartmentResponse,
} from './type';

export const getDepartmentList = async (): Promise<DepartmentListResponse> => {
  const res = await axiosInstance.get('/admin/org/invite');
  return res.data;
};

export const getDepartmentSettingList = async (): Promise<DepartmentSettingListResponse> => {
  const res = await axiosInstance.get('/admin/org/depart/setting');
  return res.data;
};

export const createDepartments = async (
  data: CreateDepartmentsRequest
): Promise<CreateDepartmentsResponse> => {
  const res = await axiosInstance.post('/admin/org/depart', data);
  return res.data;
};

export const updateDepartment = async (
  data: UpdateDepartmentRequest
): Promise<UpdateDepartmentResponse> => {
  const res = await axiosInstance.put('/admin/org/depart', data);
  return res.data;
};
