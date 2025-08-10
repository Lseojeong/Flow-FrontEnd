import { axiosInstance } from '@/apis/axiosInstance';
import {
  DepartmentSettingListResponse,
  CreateDepartmentsRequest,
  CreateDepartmentsResponse,
  UpdateDepartmentRequest,
  UpdateDepartmentResponse,
  DeleteDepartmentRequest,
  DeleteDepartmentResponse,
} from './type';

// 부서 목록 조회
export const getDepartmentList = async () => {
  const res = await axiosInstance.get('/admin/org/invite');
  return res;
};

// 부서 설정 목록 조회 (관리자 수, 카테고리 수 포함)
export const getDepartmentSettingList = async (): Promise<DepartmentSettingListResponse> => {
  const res = await axiosInstance.get('/admin/org/depart/setting');
  return res.data;
};

// 다중 부서 생성
export const createDepartments = async (
  data: CreateDepartmentsRequest
): Promise<CreateDepartmentsResponse> => {
  const res = await axiosInstance.post('/admin/org/depart', data);
  return res.data;
};

// 부서 이름 수정
export const updateDepartment = async (
  data: UpdateDepartmentRequest
): Promise<UpdateDepartmentResponse> => {
  const res = await axiosInstance.put('/admin/org/depart', data);
  return res.data;
};

// 부서 삭제
export const deleteDepartment = async (
  data: DeleteDepartmentRequest
): Promise<DeleteDepartmentResponse> => {
  const res = await axiosInstance.delete('/admin/org/depart', {
    data,
  });
  return res.data;
};
