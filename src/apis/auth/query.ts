// hooks/useAdminProfile.ts (파일 경로는 프로젝트에 맞게)
import { useQuery, useMutation } from '@tanstack/react-query';
import { getAdminProfile, verifyInvitationToken } from '@/apis/auth/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { AdminProfile } from './types';

export const useAdminProfile = () => {
  const { hasChecked, isLoggedIn } = useAuthStore();

  return useQuery<AdminProfile>({
    queryKey: ['adminProfile'],
    queryFn: getAdminProfile,
    enabled: hasChecked && isLoggedIn,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useVerifyInvitationToken = () => {
  return useMutation({
    mutationFn: verifyInvitationToken,
  });
};
