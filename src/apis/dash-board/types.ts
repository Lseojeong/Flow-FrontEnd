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
