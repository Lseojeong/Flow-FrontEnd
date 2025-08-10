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
