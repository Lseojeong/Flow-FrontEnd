import { useState, useCallback } from 'react';

export interface CategoryManagementState<T> {
  searchKeyword: string;
  selectedDepartment: string | null;
  startDate: string | null;
  endDate: string | null;
  checkedMap: Record<string, boolean>;
  isCategoryModalOpen: boolean;
  isEditModalOpen: boolean;
  editingCategory: T | null;
}

export interface CategoryManagementActions<T> {
  setSearchKeyword: (_keyword: string) => void;
  setSelectedDepartment: (_department: string | null) => void;
  setStartDate: (_date: string | null) => void;
  setEndDate: (_date: string | null) => void;
  setCheckedMap: (_map: Record<string, boolean>) => void;
  setIsCategoryModalOpen: (_open: boolean) => void;
  setIsEditModalOpen: (_open: boolean) => void;
  setEditingCategory: (_category: T | null) => void;
  handleToggleAll: (_filteredItems: T[], _itemIdExtractor: (_item: T) => string) => void;
  handleToggleOne: (_id: string) => void;
  handleDateChange: (_start: string | null, _end: string | null) => void;
  resetFilters: () => void;
}

export function useCategoryManagement<T>(): [
  CategoryManagementState<T>,
  CategoryManagementActions<T>,
] {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<T | null>(null);

  const handleToggleAll = useCallback(
    (filteredItems: T[], itemIdExtractor: (_item: T) => string) => {
      const selectedIds = filteredItems
        .filter((item) => checkedMap[itemIdExtractor(item)])
        .map(itemIdExtractor);

      const isAllSelected = filteredItems.length > 0 && selectedIds.length === filteredItems.length;

      if (isAllSelected) {
        setCheckedMap({});
      } else {
        const next: Record<string, boolean> = {};
        filteredItems.forEach((item) => {
          next[itemIdExtractor(item)] = true;
        });
        setCheckedMap(next);
      }
    },
    [checkedMap]
  );

  const handleToggleOne = useCallback((id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleDateChange = useCallback((start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchKeyword('');
    setStartDate(null);
    setEndDate(null);
    setCheckedMap({});
  }, []);

  const state: CategoryManagementState<T> = {
    searchKeyword,
    selectedDepartment,
    startDate,
    endDate,
    checkedMap,
    isCategoryModalOpen,
    isEditModalOpen,
    editingCategory,
  };

  const actions: CategoryManagementActions<T> = {
    setSearchKeyword,
    setSelectedDepartment,
    setStartDate,
    setEndDate,
    setCheckedMap,
    setIsCategoryModalOpen,
    setIsEditModalOpen,
    setEditingCategory,
    handleToggleAll,
    handleToggleOne,
    handleDateChange,
    resetFilters,
  };

  return [state, actions];
}
