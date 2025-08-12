export interface FaqFileSearchParams {
  keyword?: string;
  cursor?: string;
}

export type FaqFileStatus = 'Completed' | 'Processing' | 'Fail';

export interface FaqCategoryFileCreateBody {
  fileUrl: string;
  fileName: string;
  version: string;
  description?: string;
}

export interface FaqCategoryFileUpdateBody {
  fileUrl?: string;
  fileName?: string;
  version?: string;
  description?: string;
}

export interface FaqCategoryFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  latestVersion: string;
  status: FaqFileStatus;
  lastModifier?: string;
  createdAt: string;
  updatedAt: string;
  departmentList: string[];
}

export interface ApiEnvelope<T> {
  code: string;
  message: string;
  result: T;
}

export interface FaqFileListResult {
  fileList: FaqCategoryFile[];
  pagination: { last: boolean };
  nextCursor?: string;
}

export interface FileItem {
  id: string;
  name: string;
  fileName: string;
  status: FaqFileStatus | string;
  manager: string;
  registeredAt: string;
  updatedAt: string;
  version: string;
  fileUrl: string;
  timestamp?: string;
  departmentList: string[];
}
