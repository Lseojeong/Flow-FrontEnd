export interface DictionaryCategory {
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
  lastModifiedDate: string;
}
