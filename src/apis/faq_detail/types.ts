export interface FaqCategoryFile {
  fileId: string;
  fileName: string;
  fileUrl: string;
  latestVersion: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiBaseResponse<T> {
  code: string;
  message: string;
  result: T;
}

export interface FaqFilesListResult {
  fileList: FaqCategoryFile[];
  pagination: { last: boolean };
}

export interface UpsertFaqFileBody {
  version: string;
  description: string;
  fileUrl: string;
  fileName: string;
}

export interface SearchFaqFilesParams {
  name?: string;
  startDate?: string;
  endDate?: string;
  cursorDate?: string;
}
