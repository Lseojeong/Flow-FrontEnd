import { useCallback, useEffect, useRef, useState } from 'react';
// 변화 포인트 요약
// 1) initialCursor 기본값 제거(= undefined로 시작)
// 2) cursor 상태도 undefined로 시작
// 3) reset 시 cursor를 undefined로 되돌림
// 4) fetchFn 호출에 cursor 그대로 넘기기 (undefined면 API에서 now로 대체)

interface UseInfiniteScrollParams<T> {
  fetchFn: (_cursor?: string) => Promise<{
    code: string;
    result: {
      historyList: T[];
      pagination: { last: boolean };
      nextCursor?: string;
    };
  }>;
  // 👇 굳이 기본값 '' 주지 말고, undefined 허용
  initialCursor?: string;
  getKey?: (_item: T) => string | number;
}

export const useInfiniteScroll = <T, R extends HTMLElement = HTMLElement>({
  fetchFn,
  initialCursor, // = '' 제거
  getKey,
}: UseInfiniteScrollParams<T>) => {
  // 👇 undefined로 시작
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
      // 👇 cursor가 undefined면 그대로 넘김
      const response = await fetchFn(cursor);

      if (
        response.code === 'CATEGORY200' ||
        response.code === '200' ||
        response.code === 'COMMON200'
      ) {
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

  useEffect(() => {
    if (hasInitialLoadedRef.current) return;
    hasInitialLoadedRef.current = true;
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
      { threshold: 1.0, root: null, rootMargin: '0px 0px 200px 0px' }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const reset = () => {
    setData([]);
    setCursor(undefined); // 👈 초기화도 undefined
    setHasMore(true);
    setIsLoading(false);
    seenKeysRef.current.clear();
    isFetchingRef.current = false;
    hasInitialLoadedRef.current = false;
  };

  return { data, observerRef, isLoading, hasMore, reset, loadMore };
};
