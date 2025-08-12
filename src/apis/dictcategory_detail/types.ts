export interface FileSearchParams {
  keyword?: string;
  cursor?: string;
}

export type DictFileStatus = 'Completed' | 'Processing' | 'Fail';

export interface DictCategoryFileCreateBody {
  fileUrl: string;
  fileName: string;
  version: string;
  description?: string;
}

export interface DictCategoryFileUpdateBody {
  fileUrl?: string;
  fileName?: string;
  version?: string;
  description?: string;
}

export interface DictCategoryFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  latestVersion: string;
  status: DictFileStatus;
  lastModifier?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  fileName: string;
  status: 'Completed' | 'Processing' | 'Fail' | string;
  manager: string;
  registeredAt: string;
  updatedAt: string;
  version?: string;
  fileUrl: string;
  timestamp?: string;
}

export interface ApiEnvelope<T> {
  code: string;
  message: string;
  result: T;
}

export interface FileListResult {
  fileList: DictCategoryFile[];
  pagination: { last: boolean };
  nextCursor?: string;
}

export interface FileItem {
  id: string;
  name: string;
  fileName: string;
  status: 'Completed' | 'Processing' | 'Fail' | string;
  manager: string;
  registeredAt: string;
  updatedAt: string;
  version: string;
  fileUrl: string;
  timestamp?: string;
}
