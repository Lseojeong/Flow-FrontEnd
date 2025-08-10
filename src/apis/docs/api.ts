import { axiosInstance } from '@/apis/axiosInstance';
import type { DocsCategory } from './types';

// 전체 카테고리 조회 (cursor 필수)
export const getAllDocsCategories = async (cursor?: string) => {
  return axiosInstance.get<{
    code: string;
    message: string;
    result: {
      categoryList: DocsCategory[];
      pagination: { last: boolean };
      nextCursor?: string;
    };
  }>('/admin/docs/categories', {
    params: { cursor: cursor ?? new Date().toISOString() },
  });
};

// 단일 조회
export const getDocsCategoryById = (categoryId: string) => {
  return axiosInstance.get(`/admin/docs/categories/${categoryId}`);
};

// 생성
export const createDocsCategory = (body: {
  name: string;
  departmentIdList: string[];
  description?: string;
}) => {
  return axiosInstance.post('/admin/docs/categories', body);
};

// 수정
export const updateDocsCategory = (
  categoryId: string,
  body: { name: string; departmentIdList: string[]; description?: string }
) => {
  return axiosInstance.put(`/admin/docs/categories/${categoryId}`, body);
};

// 삭제
export const deleteDocsCategories = (categoryIdList: string[]) => {
  return axiosInstance.delete('/admin/docs/categories', {
    data: { categoryIdList },
  });
};

// 검색
export const searchDocsCategories = (params: {
  name?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  cursorDate: string;
}) => {
  return axiosInstance.get('/admin/docs/categories/search', { params });
};
