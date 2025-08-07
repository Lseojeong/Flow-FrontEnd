import { axiosInstance } from '@/apis/axiosInstance';
import { Department } from './type';

export interface DepartmentListResponse {
  code: string;
  message: string;
  result: {
    departmentList: Department[];
  };
}

export const getDepartmentList = async (): Promise<DepartmentListResponse> => {
  const res = await axiosInstance.get('/admin/org/invite');
  return res.data;
};
