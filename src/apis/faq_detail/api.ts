import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiResponse,
  FaqFileCreateRequest,
  FaqFileCreateResponse,
  FaqFileListResult,
  FaqCategoryDetail,
} from './types';

export const createFaqCategoryFile = async (categoryId: string, data: FaqFileCreateRequest) => {
  const response = await axiosInstance.post<ApiResponse<FaqFileCreateResponse>>(
    `/admin/faqs/categories/${categoryId}/files`,
    data
  );
  return response;
};

export const getFaqCategoryFiles = async (categoryId: string, cursor?: string) => {
  const params = {
    cursorDate: cursor ?? new Date().toISOString(),
  };
  return axiosInstance.get<ApiResponse<FaqFileListResult>>(
    `/admin/faqs/categories/${categoryId}/files`,
    { params }
  );
};

export const searchFaqCategoryFiles = async (
  categoryId: string,
  params: {
    name?: string;
    startDate?: string;
    endDate?: string;
    cursorDate: string;
  }
) => {
  return axiosInstance.get<ApiResponse<FaqFileListResult>>(
    `/admin/faqs/categories/${categoryId}/files/search`,
    { params }
  );
};

export const updateFaqCategoryFile = async (
  fileId: string,
  data: {
    fileUrl: string;
    fileName: string;
    description: string;
    version: string;
  }
) => {
  const response = await axiosInstance.put<ApiResponse<FaqFileCreateResponse>>(
    `/admin/faqs/categories/files/${fileId}`,
    data
  );
  return response;
};

export const deleteFaqCategoryFile = async (fileId: string) => {
  const response = await axiosInstance.delete<ApiResponse<object>>(
    `/admin/faqs/categories/files/${fileId}`
  );
  return response;
};

export const getFaqCategoryById = (categoryId: string) => {
  return axiosInstance.get<ApiResponse<FaqCategoryDetail>>(`/admin/faqs/categories/${categoryId}`);
};
