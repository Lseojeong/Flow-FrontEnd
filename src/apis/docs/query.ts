import { getAllDocsCategories } from './api';
import type { DocsCategory } from './types';

const loadedFaqIdSet = new Set<string>();

export const fetchDocsCategories = async (cursor?: string) => {
  const res = await getAllDocsCategories(cursor ?? new Date().toISOString());

  type Resp = {
    code: string;
    message: string;
    result: {
      categoryList: DocsCategory[];
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
