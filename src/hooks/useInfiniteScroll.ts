import { useRef, useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseInfiniteScrollParams<T extends { timestamp: string }> {
  fetchFn: (_cursor?: string) => Promise<{
    code: string;
    result: {
      historyList: T[];
      pagination: { isLast: boolean };
    };
  }>;
  queryKey: (string | number | boolean | null | undefined)[];
  initialCursor?: string;
  enabled?: boolean;
}

export const useInfiniteScroll = <
  T extends { timestamp: string },
  R extends HTMLElement = HTMLTableRowElement,
>({
  fetchFn,
  queryKey,
  initialCursor = '',
  enabled = true,
}: UseInfiniteScrollParams<T>) => {
  const observerRef = useRef<R | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = initialCursor }) => fetchFn(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.code !== 'COMMON200') return undefined;

      const { historyList, pagination } = lastPage.result;
      const lastItem = historyList[historyList.length - 1];
      const nextCursor = lastItem ? lastItem.timestamp : undefined;

      return !pagination.isLast && nextCursor ? nextCursor : undefined;
    },
    initialPageParam: initialCursor,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled,
  });
  const flattenedData = useMemo(
    () =>
      data?.pages.flatMap((page) =>
        page.code === 'COMMON200' || page.code === 'CATEGORY200' ? page.result.historyList : []
      ) || [],
    [data?.pages]
  );

  const reset = () => {
    refetch();
  };

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const loadInitial = () => {
    refetch();
  };

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [flattenedData, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    data: flattenedData,
    observerRef,
    isLoading,
    isFetchingNextPage,
    hasMore: hasNextPage,
    isError,
    error,
    reset,
    loadMore,
    loadInitial,
    refetch,
  };
};
