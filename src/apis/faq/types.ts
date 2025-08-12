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
  fileStatus: FaqCategoryStatus;
  documentCount: number;
  lastModifiedDate: string;
  departmentList?: string[];
  createdAt?: string;
  updatedAt?: string;
  registeredDate?: string;
  lastModifier?: string;
  lastEditor?: string;
}

export interface DepartmentApi {
  departmentId: string;
  departmentName: string;
}
