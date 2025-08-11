import { axiosInstance } from '@/apis/axiosInstance';
import {
  HistoryFilterMenuResponse,
  DashboardResponse,
  DashboardParams,
  HistoryResponse,
  HistoryParams,
} from './types';

export const getHistoryFilterMenu = async (): Promise<HistoryFilterMenuResponse> => {
  const response = await axiosInstance.get('/admin/org/history/menu');
  return response.data;
};

export const getDashboardData = async (params: DashboardParams): Promise<DashboardResponse> => {
  const response = await axiosInstance.get('/admin/org/dashboard', { params });
  return response.data;
};

export const getHistory = async (params: HistoryParams): Promise<HistoryResponse> => {
  const queryParams = new URLSearchParams();

  if (params.menu) queryParams.append('menu', params.menu);
  if (params.category) queryParams.append('category', params.category);
  if (params.files && params.files.length > 0) {
    params.files.forEach((file: string) => queryParams.append('files', file));
  }
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.cursor) queryParams.append('cursor', params.cursor);

  const res = await axiosInstance.get(`/admin/org/history?${queryParams.toString()}`);
  return res.data;
};
