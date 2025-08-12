export interface DictCategoryStatus {
  total: number;
  Completed: number;
  Processing: number;
  Fail: number;
}

export interface DictCategory {
  id: string;
  name: string;
  description?: string;
  status: DictCategoryStatus;
  documentCount: number;
  lastModifiedDate: string;
  createdAt?: string;
  updatedAt?: string;
  registeredDate?: string;
  lastModifier?: string;
  lastEditor?: string;
  fileStatus?: DictCategoryStatus;
}
