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
export const getDictCategoryFiles = (categoryId: string, cursor?: string) =>
  axiosInstance.get<ApiEnvelope<FileListResult>>(`/admin/dict/categories/${categoryId}/files`, {
    params: cursor ? { cursor } : {},
  });

/** 파일 검색 (카테고리 내) */
export const searchDictCategoryFiles = (categoryId: string, params: FileSearchParams) =>
  axiosInstance.get<ApiEnvelope<FileListResult>>(
    `/admin/dict/categories/${categoryId}/files/search`,
    { params }
  );

/** 파일 등록 (Create) */
export const createDictCategoryFile = (categoryId: string, body: DictCategoryFileCreateBody) =>
  axiosInstance.post<ApiEnvelope<unknown>>(`/admin/dict/categories/${categoryId}/files`, body);

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
