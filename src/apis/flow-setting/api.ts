import { axiosInstance } from '@/apis/axiosInstance';
import { FlowSettingResponse, FlowSettingUpdateRequest, FlowSettingUpdateResponse } from './types';

export const getFlowSetting = async (spaceId: number): Promise<FlowSettingResponse> => {
  const response = await axiosInstance.get(`/admin/org/setting/${spaceId}`);
  return response.data;
};

export const updateFlowSetting = async (
  spaceId: number,
  data: FlowSettingUpdateRequest
): Promise<FlowSettingUpdateResponse> => {
  const response = await axiosInstance.put(`/admin/org/setting/${spaceId}`, data);
  return response.data;
};
