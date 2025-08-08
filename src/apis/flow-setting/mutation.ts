import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFlowSetting } from './api';
import { FlowSettingUpdateRequest } from './types';

export const useUpdateFlowSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ spaceId, data }: { spaceId: number; data: FlowSettingUpdateRequest }) =>
      updateFlowSetting(spaceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flowSetting', variables.spaceId] });
    },
    onError: (error) => {
      console.error('Flow 설정 업데이트 실패:', error);
    },
  });
};
