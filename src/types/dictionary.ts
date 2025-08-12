export interface FileItem {
  id: string;
  name: string;
  fileName: string;
  status: 'Completed' | 'Processing' | 'Fail' | string;
  manager: string;
  registeredAt: string;
  updatedAt: string;
  version: string;
  fileUrl: string;
  timestamp?: string;
}
