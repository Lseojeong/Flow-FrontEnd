import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartments, updateDepartment, deleteDepartment } from './api';

export const useCreateDepartments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDepartments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentSettingList'] });
      queryClient.invalidateQueries({ queryKey: ['departmentList'] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentSettingList'] });
      queryClient.invalidateQueries({ queryKey: ['departmentList'] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentSettingList'] });
      queryClient.invalidateQueries({ queryKey: ['departmentList'] });
    },
  });
};
