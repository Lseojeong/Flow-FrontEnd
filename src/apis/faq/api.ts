import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiResponse,
  FaqCategory,
  FaqCategoryCreateRequest,
  FaqCategoryUpdateRequest,
  FaqCategoryUpdateResponse,
  FaqCategoryListResult,
  FaqCategorySearchRequest,
  FaqCategoryDeleteRequest,
  FaqCategoryDetail,
} from './types';

export const getAllFaqCategories = async (cursor?: string) => {
  return axiosInstance.get<ApiResponse<FaqCategoryListResult>>('/admin/faqs/categories', {
    params: { cursor: cursor ?? new Date().toISOString() },
  });
};

export const getFaqCategoryById = (categoryId: string) => {
  return axiosInstance.get<ApiResponse<FaqCategoryDetail>>(`/admin/faqs/categories/${categoryId}`);
};

export const createFaqCategory = (body: FaqCategoryCreateRequest) => {
  return axiosInstance.post<ApiResponse<FaqCategory>>('/admin/faqs/categories', body);
};

export const updateFaqCategory = (categoryId: string, body: FaqCategoryUpdateRequest) => {
  return axiosInstance.put<ApiResponse<FaqCategoryUpdateResponse>>(
    `/admin/faqs/categories/${categoryId}`,
    body
  );
};

export const deleteFaqCategories = (body: FaqCategoryDeleteRequest) => {
  return axiosInstance.delete<ApiResponse<void>>('/admin/faqs/categories', {
    data: body,
  });
};

export const searchFaqCategories = (params: FaqCategorySearchRequest) => {
  return axiosInstance.get<ApiResponse<FaqCategoryListResult>>('/admin/faqs/categories/search', {
    params,
  });
};
