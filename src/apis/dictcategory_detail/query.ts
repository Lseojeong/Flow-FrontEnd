import { getDictCategoryFiles, searchDictCategoryFiles } from './api';
import type { DictCategoryFile, FileListResult } from './types';
import { useQuery } from '@tanstack/react-query';

const loadedFileIdSetMap = new Map<string, Set<string>>();
const keyOf = (categoryId: string, keyword?: string) => `${categoryId}::${keyword ?? ''}`;
const getSet = (categoryId: string, keyword?: string) => {
  const k = keyOf(categoryId, keyword);
  let s = loadedFileIdSetMap.get(k);
  if (!s) {
    s = new Set<string>();
    loadedFileIdSetMap.set(k, s);
  }
  return s;
};

export const resetLoadedFiles = (categoryId: string, keyword?: string) => {
  loadedFileIdSetMap.delete(keyOf(categoryId, keyword));
};

export const fetchDictCategoryFiles = async (
  categoryId: string,
  opts?: { cursor?: string; keyword?: string }
) => {
  const cursor = opts?.cursor;
  const keyword = opts?.keyword?.trim() || undefined;

  const res = keyword
    ? await searchDictCategoryFiles(categoryId, { keyword, cursor })
    : await getDictCategoryFiles(categoryId, cursor);

  const data = res.data as { code: string; result: FileListResult };

  const set = getSet(categoryId, keyword);
  const deduped = (data.result?.fileList ?? []).filter((f: DictCategoryFile) => {
    if (!f.fileId) return true;
    if (set.has(f.fileId)) return false;
    set.add(f.fileId);
    return true;
  });

  return {
    code: data.code,
    result: {
      fileList: deduped,
      pagination: data.result?.pagination ?? { last: true },
      nextCursor:
        data.result?.nextCursor ??
        (data.result?.fileList?.length
          ? data.result.fileList[data.result.fileList.length - 1].updatedAt
          : undefined),
    },
  };
};

export const useDictCategoryFiles = (
  categoryId: string,
  opts?: { cursor?: string; keyword?: string }
) => {
  return useQuery({
    queryKey: ['dictCategoryFiles', categoryId, opts?.cursor, opts?.keyword],
    queryFn: () => fetchDictCategoryFiles(categoryId, opts),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};
