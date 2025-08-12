import { getAllFaqCategories } from './api';
import type { FaqCategory } from './types';

const loadedFaqIdSet = new Set<string>();

export const fetchFaqCategories = async (cursor?: string) => {
  const res = await getAllFaqCategories(cursor ?? new Date().toISOString());

  type Resp = {
    code: string;
    message: string;
    result: {
      categoryList: FaqCategory[];
      pagination: { last: boolean };
      nextCursor?: string;
    };
  };

  const data = res.data as Resp;

  const dedupedList = (data.result?.categoryList ?? []).filter((cat) => {
    if (!cat.id) return true;
    if (loadedFaqIdSet.has(cat.id)) return false;
    loadedFaqIdSet.add(cat.id);
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
