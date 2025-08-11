import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollParams<T> {
  fetchFn: (_cursor?: string) => Promise<{
    code: string;
    result: {
      historyList: T[];
      pagination: { last: boolean };
      nextCursor?: string;
    };
  }>;
  initialCursor?: string;
  getKey?: (_item: T) => string | number;
}

export const useInfiniteScroll = <T, R extends HTMLElement = HTMLElement>({
  fetchFn,
  initialCursor,
  getKey,
}: UseInfiniteScrollParams<T>) => {
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<R | null>(null);

  const isFetchingRef = useRef(false);
  const hasInitialLoadedRef = useRef(false);
  const seenKeysRef = useRef<Set<string | number>>(new Set());

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading || isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsLoading(true);

    try {
      const response = await fetchFn(cursor);
      if (['CATEGORY200', '200', 'COMMON200'].includes(response.code)) {
        const { historyList, pagination, nextCursor } = response.result;

        const toAppend = getKey
          ? historyList.filter((item) => {
              const k = getKey(item);
              if (seenKeysRef.current.has(k)) return false;
              seenKeysRef.current.add(k);
              return true;
            })
          : historyList;

        setData((prev) => [...prev, ...toAppend]);
        setCursor(nextCursor);
        setHasMore(pagination?.last === false);
      } else {
        console.error('Unexpected response code:', response.code);
      }
    } catch (error) {
      console.error('Infinite scroll fetch error:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [cursor, hasMore, isLoading, fetchFn, getKey]);

  const refetch = useCallback(async () => {
    setHasMore(true);
    setCursor(undefined);
    seenKeysRef.current.clear();
    isFetchingRef.current = false;
    hasInitialLoadedRef.current = false;

    setIsLoading(true);
    try {
      const response = await fetchFn(undefined);
      if (['CATEGORY200', '200', 'COMMON200'].includes(response.code)) {
        const { historyList, pagination, nextCursor } = response.result;

        const newData = getKey
          ? historyList.filter((item) => {
              const k = getKey(item);
              if (seenKeysRef.current.has(k)) return false;
              seenKeysRef.current.add(k);
              return true;
            })
          : historyList;

        setData(newData);
        setCursor(nextCursor);
        setHasMore(pagination?.last === false);
      } else {
        console.error('Unexpected response code:', response.code);
      }
    } catch (error) {
      console.error('Refetch error:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchFn, getKey]);

  useEffect(() => {
    if (hasInitialLoadedRef.current) return;
    hasInitialLoadedRef.current = true;
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0, root: null, rootMargin: '0px 0px 200px 0px' }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const reset = () => {
    setData([]);
    setCursor(undefined);
    setHasMore(true);
    setIsLoading(false);
    seenKeysRef.current.clear();
    isFetchingRef.current = false;
    hasInitialLoadedRef.current = false;
  };

  return { data, observerRef, isLoading, hasMore, reset, loadMore, refetch, setData };
};
