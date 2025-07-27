export interface HistoryFilterProps {
  onCancel?: () => void;
  onConfirm?: (_selectedItems: { menu: string[]; category: string[]; file: string[] }) => void;
}

export interface Category {
  category: string;
  fileList: string[];
}

export interface HistoryMenu {
  menu: string;
  categoryList: Category[];
}

export interface HistoryFilterApiResponse {
  result: {
    menuList: HistoryMenu[];
  };
}
