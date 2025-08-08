import { useQuery } from '@tanstack/react-query';
import { getHistoryFilterMenu } from './api';

// 히스토리 필터 메뉴 조회 쿼리
export const useHistoryFilterMenu = () => {
  return useQuery({
    queryKey: ['historyFilterMenu'],
    queryFn: getHistoryFilterMenu,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
