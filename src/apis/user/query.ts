import { useQuery } from '@tanstack/react-query';
import { getUserSetting } from './api';

export const useUserSetting = () => {
  return useQuery({
    queryKey: ['userSetting'],
    queryFn: getUserSetting,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
