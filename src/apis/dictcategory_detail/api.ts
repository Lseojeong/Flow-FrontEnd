// /apis/dictcategory_detail/api.ts
import { axiosInstance } from '@/apis/axiosInstance';
import type {
  FileSearchParams,
  DictCategoryFileCreateBody,
  DictCategoryFileUpdateBody,
  ApiEnvelope,
  FileListResult,
} from './types';

/** 파일 리스트 조회 (커서 기반) */
export const getDictCategoryFiles = (categoryId: string, cursor?: string) => {
  return axiosInstance.get<ApiEnvelope<FileListResult>>(
    `/admin/dict/categories/${categoryId}/files`,
    { params: cursor ? { cursor } : {} }
  );
};

/** 파일 검색 (카테고리 내) */
export const searchDictCategoryFiles = (categoryId: string, params: FileSearchParams) =>
  axiosInstance.get<ApiEnvelope<FileListResult>>(
    `/admin/dict/categories/${categoryId}/files/search`,
    { params }
  );

/** 파일 등록 (Create) - presigned 업로드 후 fileUrl, fileName 사용 */
export const createDictCategoryFile = async (
  categoryId: string,
  body: DictCategoryFileCreateBody
) => {
  // body.fileName 에 경로 없이 원본 파일명만 들어가야 함
  const cleanFileName = body.fileName.split('/').pop() || body.fileName;

  return axiosInstance.post<ApiEnvelope<unknown>>(`/admin/dict/categories/${categoryId}/files`, {
    ...body,
    fileName: cleanFileName,
  });
};

/** 파일 수정 (Update) */
export const updateDictCategoryFile = (
  categoryId: string,
  fileId: string,
  body: DictCategoryFileUpdateBody
) =>
  axiosInstance.put<ApiEnvelope<unknown>>(
    `/admin/dict/categories/${categoryId}/files/${fileId}`,
    body
  );

/** 파일 삭제 */
export const deleteDictCategoryFile = (categoryId: string, fileId: string) =>
  axiosInstance.delete<ApiEnvelope<unknown>>(
    `/admin/dict/categories/${categoryId}/files/${fileId}`
  );

export interface DictFileHistory {
  version: string;
  fileName: string;
  lastModifierName: string;
  lastModifierId: string;
  timestamp: string;
  work: string;
  description: string;
  fileUrl: string;
}

export interface DictFileHistoryResult {
  historyList: DictFileHistory[];
  pagination: {
    last: boolean;
  };
  nextCursor?: string;
}

/** 용어사전 파일 히스토리 조회 (커서 기반) */
export const getDictFileHistories = (fileId: string, cursor?: string) =>
  axiosInstance.get<ApiEnvelope<DictFileHistoryResult>>(
    `/admin/dict/categories/files/${fileId}/histories`,
    {
      params: cursor ? { cursor } : {},
    }
  );

/** 용어사전 파일 히스토리 검색 */
export interface DictFileHistorySearchParams {
  startDate?: string; // yyyy-MM-dd
  endDate?: string; // yyyy-MM-dd
  cursor?: string; // ISO DateTime
}

export const searchDictFileHistories = (fileId: string, params: DictFileHistorySearchParams) =>
  axiosInstance.get<ApiEnvelope<DictFileHistoryResult>>(
    `/admin/dict/categories/files/${fileId}/histories/search`,
    {
      params,
    }
  );
