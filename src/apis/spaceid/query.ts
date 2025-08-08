import { useQuery } from '@tanstack/react-query';
import { getSpaceIdList } from './api';

export const useSpaceList = () => {
  return useQuery({
    queryKey: ['spaceList'],
    queryFn: getSpaceIdList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
