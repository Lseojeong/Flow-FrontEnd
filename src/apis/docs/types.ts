export interface DocsCategoryStatus {
  total: number;
  completed: number;
  processing: number;
  fail: number;
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
