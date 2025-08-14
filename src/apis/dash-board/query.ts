import { useQuery } from '@tanstack/react-query';
import { getHistoryFilterMenu, getDashboardData, getHistory } from './api';
import { DashboardParams, HistoryParams } from './types';

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
    queryKey: ['dashboardData', params.startDate, params.endDate],
    queryFn: () => getDashboardData(params),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

export const useHistory = (params: HistoryParams) => {
  return useQuery({
    queryKey: ['history', params],
    queryFn: () => getHistory(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
