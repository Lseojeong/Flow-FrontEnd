import { HistoryMenu, Category } from '@/apis/dash-board/types';

export interface HistoryFilterProps {
  onCancel?: () => void;
  onConfirm?: (_selectedItems: { menu: string[]; category: string[]; file: string[] }) => void;
}

export type { HistoryMenu, Category };
