import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollParams<T> {
  fetchFn: (_page: number, _size: number) => { result: { historyList: T[]; pagination: { last: boolean } }; code: string };
  pageSize?: number;
}

export const useInfiniteScroll = <T, R extends HTMLElement = HTMLElement>({
  fetchFn,
  pageSize = 15,
}: UseInfiniteScrollParams<T>) =>  {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<R | null>(null);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);

    const response = fetchFn(page, pageSize);
    if (response.code === '200') {
      const { historyList, pagination } = response.result;
      setData((prev) => [...prev, ...historyList]);
      setPage((prev) => prev + 1);
      setHasMore(!pagination.last);
    }

    setIsLoading(false);
  }, [hasMore, isLoading, page, fetchFn, pageSize]);

  useEffect(() => {
    
    loadMore();
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