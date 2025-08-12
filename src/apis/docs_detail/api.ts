import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiResponse,
  DocsFileCreateRequest,
  DocsFileCreateResponse,
  DocsFileListResult,
  DocsCategoryDetail,
} from './types';

export const createDocsCategoryFile = (categoryId: string, body: DocsFileCreateRequest) => {
  return axiosInstance.post<ApiResponse<DocsFileCreateResponse>>(
    `/admin/docs/categories/${categoryId}/files`,
    body
  );
};

export const getDocsCategoryFiles = (categoryId: string, cursor?: string) => {
  return axiosInstance.get<ApiResponse<DocsFileListResult>>(
    `/admin/docs/categories/${categoryId}/files`,
    {
      params: { cursor: cursor ?? new Date().toISOString() },
    }
  );
};

export const getDocsCategoryById = (categoryId: string) => {
  return axiosInstance.get<ApiResponse<DocsCategoryDetail>>(`/admin/docs/categories/${categoryId}`);
};
