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
    queryFn: ({ pageParam = initialCursor }) => {
      return fetchFn(pageParam);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.code !== 'COMMON200') {
        return undefined;
      }

      const { historyList, pagination } = lastPage.result;
      const lastItem = historyList[historyList.length - 1];

      const convertToKST = (dateString: string) => {
        const serverDate = new Date(dateString.trim());
        const koreaTime = new Date(serverDate.getTime() + 9 * 60 * 60 * 1000);
        return koreaTime.toISOString().slice(0, 19);
      };

      const getCursorValue = () => {
        if (lastItem?.timestamp && lastItem.timestamp.trim()) {
          return convertToKST(lastItem.timestamp);
        }
        if (
          lastItem &&
          'lastModifiedDate' in lastItem &&
          lastItem.lastModifiedDate &&
          String(lastItem.lastModifiedDate).trim()
        ) {
          return convertToKST(String(lastItem.lastModifiedDate));
        }
        if (
          lastItem &&
          'updatedAt' in lastItem &&
          lastItem.updatedAt &&
          String(lastItem.updatedAt).trim()
        ) {
          return convertToKST(String(lastItem.updatedAt));
        }
        if (
          lastItem &&
          'createdAt' in lastItem &&
          lastItem.createdAt &&
          String(lastItem.createdAt).trim()
        ) {
          return convertToKST(String(lastItem.createdAt));
        }
        return undefined;
      };

      const nextCursor = getCursorValue();

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
      data?.pages.flatMap((page) => (page.code === 'COMMON200' ? page.result.historyList : [])) ||
      [],
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
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0].isIntersecting;

        if (isIntersecting && !isFetchingNextPage && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
