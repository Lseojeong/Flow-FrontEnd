export interface HistoryFilterMenuResponse {
  code: string;
  message: string;
  result: {
    menuList: HistoryMenu[];
  };
}

export interface HistoryMenu {
  menu: string;
  categoryList: Category[];
}

export interface Category {
  category: string;
  fileList: string[];
}

export interface DashboardResponse {
  code: string;
  message: string;
  result: {
    status: {
      total: number;
      completed: number;
      processing: number;
      fail: number;
    };
    responseTime: {
      average: string;
      fastest: string;
      slowest: string;
    };
    workHistory: {
      total: number;
      dictionary: number;
      document: number;
      faq: number;
    };
    question: {
      total: number;
      smallTalk: number;
      rag: number;
    };
    requestVolume: Array<{
      time: string;
      requests: number;
    }>;
  };
}

export interface DashboardParams {
  startTime: string;
  endTime: string;
}

export interface HistoryItem {
  version: string;
  fileName: string;
  lastModifierName: string;
  lastModifierId: string;
  lastModifierAdminId: string;
  timestamp: string;
  work: string;
  description: string;
  fileUrl: string;
}

export interface HistoryPagination {
  isLast: boolean;
}

export interface HistoryResponse {
  code: string;
  message: string;
  result: {
    historyList: HistoryItem[];
    pagination: HistoryPagination;
  };
}

export interface HistoryParams {
  menu?: string;
  category?: string;
  files?: string[];
  startDate?: string;
  endDate?: string;
  cursor?: string;
}
