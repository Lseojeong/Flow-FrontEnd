export interface FaqCategory {
  id: number;
  name: string;
  description: string;
  status: {
    green: number;
    yellow: number;
    red: number;
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
