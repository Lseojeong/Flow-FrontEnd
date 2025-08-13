import { useQuery } from '@tanstack/react-query';
import { getAllDocsCategories, getDocsCategoryById } from './api';
import type { DocsCategoryListResult } from './types';

const loadedCategoryIdSet = new Set<string>();

export const fetchDocsCategories = async (cursor?: string): Promise<DocsCategoryListResult> => {
  const res = await getAllDocsCategories(cursor ?? new Date().toISOString());
  const data = res.data;

  const dedupedList = (data.result?.categoryList ?? []).filter((category) => {
    if (!category.id) return true;
    if (loadedCategoryIdSet.has(category.id)) return false;
    loadedCategoryIdSet.add(category.id);
    return true;
  });

  return {
    categoryList: dedupedList,
    pagination: data.result?.pagination ?? { last: true },
  };
};

export const clearLoadedCategories = () => {
  loadedCategoryIdSet.clear();
};

export const useDocsCategories = (cursor?: string) => {
  return useQuery({
    queryKey: ['docs-categories', cursor],
    queryFn: () => fetchDocsCategories(cursor),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useDocsCategoryById = (categoryId: string) => {
  return useQuery({
    queryKey: ['docs-category', categoryId],
    queryFn: () => getDocsCategoryById(categoryId).then((res) => res.data.result),
    enabled: !!categoryId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
