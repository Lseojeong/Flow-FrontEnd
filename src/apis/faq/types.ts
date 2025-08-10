export interface FaqCategoryStatus {
  total: number;
  completed: number;
  processing: number;
  fail: number;
}

export interface FaqCategory {
  id: string; // UUID
  name: string;
  description?: string;
  status: FaqCategoryStatus;
  documentCount: number;
  lastModifiedDate: string;
  departmentList?: string[];
  createdAt?: string;
  updatedAt?: string;
  registeredDate?: string;
  lastModifier?: string;
  lastEditor?: string;
}
