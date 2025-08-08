export interface DictCategoryStatus {
  completed: number;
  processing: number;
  fail: number;
}

export interface DictCategory {
  id: number;
  name: string;
  description: string;
  status: DictCategoryStatus;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
  registeredDate: string;
  lastModified: string;
  lastEditor: string;
  lastModifiedDate: string;
}
