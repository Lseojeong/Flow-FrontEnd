export interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

export interface DocsFileCreateRequest {
  fileUrl: string;
  fileName: string;
  description: string;
  version: string;
}

export interface DocsFileCreateResponse {
  fileId: string;
  fileName: string;
  fileUrl: string;
  latestVersion: string;
  status: 'Completed' | 'Processing' | 'Fail';
  createdAt: string;
  updatedAt: string;
}

export interface DocsFile {
  fileId: string;
  fileName: string;
  status: 'Completed' | 'Processing' | 'Fail';
  lastModifierName: string;
  lastModifierId: string;
  createdAt: string;
  updatedAt: string;
  fileUrl: string;
  latestVersion: string;
}

export interface DocsFileListResult {
  fileList: DocsFile[];
  pagination: {
    last: boolean;
    nextCursor?: string;
  };
}

export interface DocsCategoryDetail {
  name: string;
  description: string;
  status: {
    Total: number;
    Completed: number;
    Processing: number;
    Fail: number;
  };
  createdAt: string;
  updatedAt: string;
  lastModifierId: string;
  lastModifierName: string;
  departmentList: string[];
}

export interface EditTargetFile {
  title: string;
  version: string;
  fileId: string;
  fileUrl: string;
  latestVersion: string;
}
