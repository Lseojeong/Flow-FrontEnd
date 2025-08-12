import { axiosInstance } from '@/apis/axiosInstance';

export interface DepartmentApi {
  id: string;
  name: string;
}

export const getDepartments = async () => {
  return axiosInstance.get<{
    code: string;
    message: string;
    result: { departmentList: DepartmentApi[] };
  }>('/admin/org/invite');
};
