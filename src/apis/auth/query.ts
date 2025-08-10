import { useQuery } from '@tanstack/react-query';
import { getAdminProfile } from '@/apis/auth/api';
import type { AdminProfile } from './types';

export const useAdminProfile = (enabled = true) => {
  return useQuery<AdminProfile>({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
