import { axiosInstance } from '@/apis/axiosInstance';
import type { FaqCategory } from './types';

// 전체 카테고리 조회 (cursor 필수)
export const getAllFaqCategories = async (cursor?: string) => {
  return axiosInstance.get<{
    code: string;
    message: string;
    result: {
      categoryList: FaqCategory[];
      pagination: { last: boolean };
      nextCursor?: string;
    };
  }>('/admin/faqs/categories', {
    params: { cursor: cursor ?? new Date().toISOString() },
  });
};

// 조건 검색
interface SearchFaqParams {
  name?: string;
  startDate?: string;
  endDate?: string;
  cursorDate?: string;
}
export const searchFaqCategories = async (params: SearchFaqParams) => {
  return axiosInstance.get('/admin/faqs/categories/search', {
    params: {
      ...params,
      cursorDate: params.cursorDate || '2024-01-01T00:00:00',
    },
  });
};

// 단일 조회
export const getFaqCategoryById = (categoryId: string) => {
  return axiosInstance.get(`/admin/faqs/categories/${categoryId}`);
};

// 생성
export const createFaqCategory = (body: {
  name: string;
  description?: string;
  departmentList: { id: string }[];
}) => {
  return axiosInstance.post('/admin/faqs/categories', body);
};

// 수정
export const updateFaqCategory = (
  categoryId: string,
  body: {
    name: string;
    description?: string;
    departmentList: { id: string }[];
  }
) => {
  return axiosInstance.put(`/admin/faqs/categories/${categoryId}`, body);
};

// 삭제
export const deleteFaqCategories = (categoryIdList: string[]) => {
  return axiosInstance.delete('/admin/faqs/categories', {
    data: { categoryIdList },
  });
};
