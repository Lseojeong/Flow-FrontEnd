export interface HistoryFilterProps {
  onCancel?: () => void;
  onConfirm?: (_selectedItems: { menu: string[]; category: string[]; file: string[] }) => void;
}

export interface MenuItem {
  id: string;
  label: string;
}

export interface CategoryItem {
  id: string;
  label: string;
}

export interface FileItem {
  id: string;
  label: string;
}
