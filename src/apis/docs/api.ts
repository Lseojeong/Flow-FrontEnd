import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiResponse,
  DocsCategory,
  DocsCategoryCreateRequest,
  DocsCategoryUpdateRequest,
  DocsCategoryUpdateResponse,
  DocsCategoryListResult,
  DocsCategorySearchRequest,
  DocsCategoryDeleteRequest,
  DocsCategoryDetail,
} from './types';

export const getAllDocsCategories = async (cursor?: string) => {
  return axiosInstance.get<ApiResponse<DocsCategoryListResult>>('/admin/docs/categories', {
    params: { cursor: cursor ?? new Date().toISOString() },
  });
};

export const getDocsCategoryById = (categoryId: string) => {
  return axiosInstance.get<ApiResponse<DocsCategoryDetail>>(`/admin/docs/categories/${categoryId}`);
};

export const createDocsCategory = (body: DocsCategoryCreateRequest) => {
  return axiosInstance.post<ApiResponse<DocsCategory>>('/admin/docs/categories', body);
};

export const updateDocsCategory = (categoryId: string, body: DocsCategoryUpdateRequest) => {
  return axiosInstance.put<ApiResponse<DocsCategoryUpdateResponse>>(
    `/admin/docs/categories/${categoryId}`,
    body
  );
};

export const deleteDocsCategories = (body: DocsCategoryDeleteRequest) => {
  return axiosInstance.delete<ApiResponse<void>>('/admin/docs/categories', {
    data: body,
  });
};

export const searchDocsCategories = (params: DocsCategorySearchRequest) => {
  return axiosInstance.get<ApiResponse<DocsCategoryListResult>>('/admin/docs/categories/search', {
    params,
  });
};
