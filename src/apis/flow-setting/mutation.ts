import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFlowSetting, testFlowSetting } from './api';
import { FlowSettingUpdateRequest, FlowSettingTestRequest } from './types';

export const useUpdateFlowSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, data }: { spaceId: number; data: FlowSettingUpdateRequest }) =>
      updateFlowSetting(spaceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flowSetting', variables.spaceId] });
    },
  });
};

export const useTestFlowSetting = () => {
  return useMutation({
    mutationFn: (data: FlowSettingTestRequest) => testFlowSetting(data),
  });
};
