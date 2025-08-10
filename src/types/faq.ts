export interface FaqCategory {
  id: number;
  name: string;
  description: string;
  status: {
    total: number;
    completed: number;
    processing: number;
    fail: number;
  };
  documentCount: number;
  lastModified: string;
  lastModifiedDate: string;
  departments: {
    departmentId: string;
    departmentName: string;
  }[];
}
