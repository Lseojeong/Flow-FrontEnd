export interface DictionaryCategory {
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
  lastModifiedDate: string;
}

export interface FileItem {
  id: string;
  name: string;
  fileName: string;
  status: string;
  manager: string;
  registeredAt: string;
  updatedAt: string;
  version?: string;
  fileUrl: string;
}
