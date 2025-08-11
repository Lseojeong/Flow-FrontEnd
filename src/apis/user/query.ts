import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserSetting,
  changeAdminDepartment,
  getDepartmentList,
  inviteAdmin,
  deleteAdmin,
} from './api';

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

export const useDepartmentList = () => {
  return useQuery({
    queryKey: ['departmentList'],
    queryFn: getDepartmentList,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useChangeAdminDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeAdminDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSetting'] });
    },
  });
};

export const useInviteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSetting'] });
    },
  });
};

export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSetting'] });
    },
  });
};
