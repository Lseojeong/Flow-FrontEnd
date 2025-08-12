import { useQuery } from '@tanstack/react-query';
import { getFaqCategoryFiles, searchFaqCategoryFiles } from './api';
import type { FaqCategoryFile } from './types';

const loadedFaqFileIdSetByCategory = new Map<string, Set<string>>();

const getIdSet = (categoryId: string) => {
  if (!loadedFaqFileIdSetByCategory.has(categoryId)) {
    loadedFaqFileIdSetByCategory.set(categoryId, new Set<string>());
  }
  return loadedFaqFileIdSetByCategory.get(categoryId)!;
};

export const resetFaqFilesDedup = (categoryId?: string) => {
  if (!categoryId) {
    loadedFaqFileIdSetByCategory.clear();
    return;
  }
  loadedFaqFileIdSetByCategory.delete(categoryId);
};

type FetchFaqFilesParams = {
  cursorDate?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
};

export const fetchFaqFiles = async (categoryId: string, params?: FetchFaqFilesParams) => {
  const cursorDate = params?.cursorDate ?? new Date().toISOString();
  const hasSearch = Boolean(params?.name || params?.startDate || params?.endDate);

  const res = hasSearch
    ? await searchFaqCategoryFiles(categoryId, {
        name: params?.name,
        startDate: params?.startDate,
        endDate: params?.endDate,
        cursorDate,
      })
    : await getFaqCategoryFiles(categoryId, cursorDate);

  type Resp = {
    code: string;
    message: string;
    result: {
      fileList: FaqCategoryFile[];
      pagination: { last: boolean };
      nextCursor?: string;
    };
  };

  const data = res.data as Resp;

  const idSet = getIdSet(categoryId);
  const dedupedList = (data.result?.fileList ?? []).filter((f) => {
    if (!f.fileId) return true;
    if (idSet.has(f.fileId)) return false;
    idSet.add(f.fileId);
    return true;
  });

  return {
    code: data.code,
    result: {
      fileList: dedupedList,
      pagination: data.result?.pagination ?? { last: true },
      nextCursor: data.result?.nextCursor,
    },
  };
};

export const useFaqFiles = (categoryId: string, params?: FetchFaqFilesParams) => {
  return useQuery({
    queryKey: ['faqFiles', categoryId, params],
    queryFn: () => fetchFaqFiles(categoryId, params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
