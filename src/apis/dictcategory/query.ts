import { useQuery } from '@tanstack/react-query';
import { getAllDictCategories } from './api';
import type { DictCategory } from './types';

const loadedIdSet = new Set<string>();

export const fetchDictCategories = async (cursor?: string) => {
  const res = await getAllDictCategories(cursor);

  type Resp = {
    code: string;
    message: string;
    result: {
      categoryList: DictCategory[];
      pagination: { last: boolean };
      nextCursor?: string;
    };
  };

  const data = res.data as Resp;

  const dedupedList = (data.result?.categoryList ?? []).filter((cat) => {
    if (!cat.id) return true;
    if (loadedIdSet.has(cat.id)) return false;
    loadedIdSet.add(cat.id);
    return true;
  });

  return {
    code: data.code,
    result: {
      categoryList: dedupedList,
      pagination: data.result?.pagination ?? { last: true },
      nextCursor: data.result?.nextCursor,
    },
  };
};

export const useDictCategories = (cursor?: string) => {
  return useQuery({
    queryKey: ['dictCategories', cursor],
    queryFn: () => fetchDictCategories(cursor),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
