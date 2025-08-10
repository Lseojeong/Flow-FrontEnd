import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserSetting, changeAdminDepartment, getDepartmentList } from './api';

export const useUserSetting = () => {
  return useQuery({
    queryKey: ['userSetting'],
    queryFn: getUserSetting,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDepartmentList = () => {
  return useQuery({
    queryKey: ['departmentList'],
    queryFn: getDepartmentList,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
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
