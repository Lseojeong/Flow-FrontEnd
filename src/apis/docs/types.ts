export interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

export interface DocsCategoryStatus {
  Total: number;
  Completed: number;
  Processing: number;
  Fail: number;
}

export interface DocsCategory {
  id: string;
  name: string;
  description?: string;
  status: DocsCategoryStatus;
  documentCount: number;
  departmentList?: string[];
  lastModifiedDate: string;
  createdAt?: string;
  updatedAt?: string;
  lastModifier?: string;
  lastEditor?: string;
}

export interface PaginationInfo {
  last: boolean;
  nextCursor?: string;
}

export interface DocsCategoryListResult {
  categoryList: DocsCategory[];
  pagination: PaginationInfo;
}

export interface DocsCategoryCreateRequest {
  name: string;
  description?: string;
  departmentIdList: string[];
}

export interface DocsCategoryUpdateRequest {
  name: string;
  description: string;
  departmentIdList: string[];
}

export interface DocsCategoryUpdateResponse {
  categoryId: string;
  name: string;
  departmentList: string[];
  description: string;
}

export interface DocsCategorySearchRequest {
  name?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  cursorDate: string;
}

export interface DocsCategoryDeleteRequest {
  categoryIdList: string[];
}

export interface DocsCategoryDetail {
  name: string;
  description: string;
  status: DocsCategoryStatus;
  createdAt: string;
  updatedAt: string;
  lastModifierId: string;
  lastModifierName: string;
  departmentList: string[];
  latestVersion: string;
}
