import { axiosInstance } from '@/apis/axiosInstance';
import type {
  FaqFileSearchParams,
  FaqCategoryFileCreateBody,
  FaqCategoryFileUpdateBody,
  ApiEnvelope,
  FaqFileListResult,
} from '@/apis/faq_detail/types';

// 파일 생성
export const createFaqCategoryFile = (categoryId: string, body: FaqCategoryFileCreateBody) => {
  return axiosInstance.post<ApiEnvelope<string>>(
    `/admin/faqs/categories/${categoryId}/files`,
    body
  );
};

// 파일 수정
export const updateFaqCategoryFile = (fileId: string, body: FaqCategoryFileUpdateBody) => {
  return axiosInstance.put<ApiEnvelope<string>>(`/admin/faqs/categories/files/${fileId}`, body);
};

// 파일 삭제
export const deleteFaqCategoryFile = (fileId: string) => {
  return axiosInstance.delete<ApiEnvelope<Record<string, never>>>(
    `/admin/faqs/categories/files/${fileId}`
  );
};

export const getFaqCategoryFiles = (categoryId: string, cursorDate?: string) => {
  const dateParam = cursorDate?.trim() ? cursorDate : '2025-01-01T00:00:00';

  return axiosInstance.get<ApiEnvelope<FaqFileListResult>>(
    `/admin/faqs/categories/${categoryId}/files`,
    { params: { cursorDate: dateParam } }
  );
};

// 파일 검색
export const searchFaqCategoryFiles = (categoryId: string, params: FaqFileSearchParams) => {
  return axiosInstance.get<ApiEnvelope<FaqFileListResult>>(
    `/admin/faqs/categories/${categoryId}/files/search`,
    { params }
  );
};
