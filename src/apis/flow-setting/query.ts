import { useQuery } from '@tanstack/react-query';
import { getFlowSetting } from './api';

export const useFlowSetting = (spaceId: number) => {
  return useQuery({
    queryKey: ['flowSetting', spaceId],
    queryFn: () => getFlowSetting(spaceId),
    enabled: !!spaceId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
