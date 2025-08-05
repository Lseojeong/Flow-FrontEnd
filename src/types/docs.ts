export interface DocsCategory {
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
  registeredDate: string;
  lastModified: string;
  lastModifiedDate: string;
  lastEditor: string;
  departments: {
    departmentId: string;
    departmentName: string;
  }[];
}
