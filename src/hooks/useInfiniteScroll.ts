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
}

export const useInfiniteScroll = <T, R extends HTMLElement = HTMLElement>({
  fetchFn,
  initialCursor = '',
}: UseInfiniteScrollParams<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<R | null>(null);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetchFn(cursor);
      if (response.code.includes('200')) {
        const { historyList, pagination, nextCursor } = response.result;
        setData((prev) => [...prev, ...historyList]);
        setCursor(nextCursor);
        setHasMore(!pagination.last && !!nextCursor);
      } else {
        console.error(' Unexpected response code:', response.code);
      }
    } catch (error) {
      console.error(' Infinite scroll fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, cursor, hasMore, isLoading]);

  useEffect(() => {
    if (data.length === 0 && !isLoading) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [data, hasMore, isLoading, loadMore]);

  return {
    data,
    observerRef,
    isLoading,
    hasMore,
  };
};
