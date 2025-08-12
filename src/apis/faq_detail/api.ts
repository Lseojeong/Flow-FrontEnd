import { axiosInstance } from '@/apis/axiosInstance';
import type {
  ApiBaseResponse,
  FaqFilesListResult,
  UpsertFaqFileBody,
  SearchFaqFilesParams,
} from '@/apis/faq_detail/types';

export const createFaqCategoryFile = (categoryId: string, body: UpsertFaqFileBody) => {
  return axiosInstance.post<ApiBaseResponse<string>>(
    `/admin/faqs/categories/${categoryId}/files`,
    body
  );
};

export const updateFaqCategoryFile = (fileId: string, body: UpsertFaqFileBody) => {
  return axiosInstance.put<ApiBaseResponse<string>>(`/admin/faqs/categories/files/${fileId}`, body);
};

export const deleteFaqCategoryFile = (fileId: string) => {
  return axiosInstance.delete<ApiBaseResponse<Record<string, never>>>(
    `/admin/faqs/categories/files/${fileId}`
  );
};

export const getFaqCategoryFiles = (categoryId: string, cursorDate: string) => {
  return axiosInstance.get<ApiBaseResponse<FaqFilesListResult>>(
    `/admin/faqs/categories/${categoryId}/files`,
    { params: { cursorDate } }
  );
};

export const searchFaqCategoryFiles = (categoryId: string, params: SearchFaqFilesParams) => {
  return axiosInstance.get<ApiBaseResponse<FaqFilesListResult>>(
    `/admin/faqs/categories/${categoryId}/files/search`,
    { params }
  );
};
