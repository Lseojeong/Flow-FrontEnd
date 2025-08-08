import { axiosInstance } from '@/apis/axiosInstance';
import { UserSettingResponse } from './types';

export const getUserSetting = async (): Promise<UserSettingResponse> => {
  const res = await axiosInstance.get('/admin/org/setting');
  return res.data;
};
