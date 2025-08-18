export interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
}

export interface FaqCategoryStatus {
  Total: number;
  Completed: number;
  Processing: number;
  Fail: number;
}

export interface FaqCategory {
  id: string;
  name: string;
  description?: string;
  status: FaqCategoryStatus;
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

export interface FaqCategoryListResult {
  categoryList: FaqCategory[];
  pagination: PaginationInfo;
}

export interface FaqCategoryCreateRequest {
  name: string;
  description?: string;
  departmentIdList: string[];
}

export interface FaqCategoryUpdateRequest {
  name: string;
  description: string;
  departmentIdList: string[];
}

export interface FaqCategoryUpdateResponse {
  categoryId: string;
  name: string;
  departmentList: string[];
  description: string;
}

export interface FaqCategorySearchRequest {
  name?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  cursorDate: string;
}

export interface FaqCategoryDeleteRequest {
  categoryIdList: string[];
}

export interface FaqCategoryDetail {
  name: string;
  description: string;
  status: FaqCategoryStatus;
  createdAt: string;
  updatedAt: string;
  lastModifierId: string;
  lastModifierName: string;
  departmentList: string[];
  latestVersion: string;
}
