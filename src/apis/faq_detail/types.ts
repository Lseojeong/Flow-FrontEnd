export interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

export interface FaqFileCreateRequest {
  fileUrl: string;
  fileName: string;
  description: string;
  version: string;
}

export interface FaqFileCreateResponse {
  fileId: string;
  fileName: string;
  fileUrl: string;
  latestVersion: string;
  status: 'Completed' | 'Processing' | 'Fail';
  createdAt: string;
  updatedAt: string;
}

export interface FaqFile {
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

export interface FaqFileListResult {
  fileList: FaqFile[];
  pagination: {
    last: boolean;
    nextCursor?: string;
  };
}

export interface FaqCategoryDetail {
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
