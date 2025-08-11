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
