import { axiosInstance } from '@/apis/axiosInstance';
import { HistoryFilterMenuResponse } from './types';

export const getHistoryFilterMenu = async (): Promise<HistoryFilterMenuResponse> => {
  const response = await axiosInstance.get('/admin/org/history/menu');
  return response.data;
};
