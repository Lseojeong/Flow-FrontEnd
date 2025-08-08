import { useQuery } from '@tanstack/react-query';
import { getAdminProfile } from '@/apis/auth/api';

export const useAdminProfile = (shouldFetch: boolean) => {
  return useQuery({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
  });
};
