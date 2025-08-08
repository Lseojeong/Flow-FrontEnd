import { axiosInstance } from '@/apis/axiosInstance';
import { DepartmentListResponse, DepartmentSettingListResponse } from './type';

export const getDepartmentList = async (): Promise<DepartmentListResponse> => {
  const res = await axiosInstance.get('/admin/org/invite');
  return res.data;
};

export const getDepartmentSettingList = async (): Promise<DepartmentSettingListResponse> => {
  const res = await axiosInstance.get('/admin/org/depart/setting');
  return res.data;
};
