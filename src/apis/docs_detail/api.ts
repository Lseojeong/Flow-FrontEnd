import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiResponse,
  DocsFileCreateRequest,
  DocsFileCreateResponse,
  DocsFileListResult,
  DocsCategoryDetail,
} from './types';

export const createDocsCategoryFile = async (categoryId: string, data: DocsFileCreateRequest) => {
  const response = await axiosInstance.post<ApiResponse<DocsFileCreateResponse>>(
    `/admin/docs/categories/${categoryId}/files`,
    data
  );
  return response;
};

export const getDocsCategoryFiles = async (categoryId: string, cursor?: string) => {
  const params = cursor ? { cursor } : {};
  const response = await axiosInstance.get<ApiResponse<DocsFileListResult>>(
    `/admin/docs/categories/${categoryId}/files`,
    { params }
  );
  return response;
};

export const searchDocsCategoryFiles = async (
  categoryId: string,
  fileName: string,
  cursor?: string
) => {
  const params = {
    fileName,
    ...(cursor && { cursor }),
  };
  const response = await axiosInstance.get<ApiResponse<DocsFileListResult>>(
    `/admin/docs/categories/${categoryId}/files/search`,
    { params }
  );
  return response;
};

export const updateDocsCategoryFile = async (
  fileId: string,
  data: {
    fileUrl: string;
    fileName: string;
    description: string;
    version: string;
  }
) => {
  const response = await axiosInstance.put<ApiResponse<DocsFileCreateResponse>>(
    `/admin/docs/categories/files/${fileId}`,
    data
  );
  return response;
};

export const deleteDocsCategoryFile = async (fileId: string) => {
  const response = await axiosInstance.delete<ApiResponse<object>>(
    `/admin/docs/categories/files/${fileId}`
  );
  return response;
};

export const getDocsCategoryById = (categoryId: string) => {
  return axiosInstance.get<ApiResponse<DocsCategoryDetail>>(`/admin/docs/categories/${categoryId}`);
};
