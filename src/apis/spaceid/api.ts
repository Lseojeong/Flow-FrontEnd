import { axiosInstance } from '@/apis/axiosInstance';
import { SpaceIdListResponse } from './types';

export const getSpaceIdList = async (): Promise<SpaceIdListResponse> => {
  const response = await axiosInstance.get('/admin/org/space');
  return response.data;
};
