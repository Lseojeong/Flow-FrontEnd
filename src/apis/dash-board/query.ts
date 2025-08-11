import { useQuery } from '@tanstack/react-query';
import { getHistoryFilterMenu, getDashboardData } from './api';
import { DashboardParams } from './types';

export const useHistoryFilterMenu = () => {
  return useQuery({
    queryKey: ['historyFilterMenu'],
    queryFn: getHistoryFilterMenu,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useDashboardData = (params: DashboardParams) => {
  return useQuery({
    queryKey: ['dashboardData', params.startTime, params.endTime],
    queryFn: () => getDashboardData(params),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
