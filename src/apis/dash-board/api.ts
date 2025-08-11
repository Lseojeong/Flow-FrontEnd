import { axiosInstance } from '@/apis/axiosInstance';
import { HistoryFilterMenuResponse, DashboardResponse, DashboardParams } from './types';

export const getHistoryFilterMenu = async (): Promise<HistoryFilterMenuResponse> => {
  const response = await axiosInstance.get('/admin/org/history/menu');
  return response.data;
};

export const getDashboardData = async (params: DashboardParams): Promise<DashboardResponse> => {
  const response = await axiosInstance.get('/admin/org/dashboard', { params });
  return response.data;
};
