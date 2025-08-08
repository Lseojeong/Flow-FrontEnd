import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartments, updateDepartment } from './api';
import type { CreateDepartmentsRequest, UpdateDepartmentRequest } from './type';

export const useCreateDepartments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDepartmentsRequest) => createDepartments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentSettingList'] });
      queryClient.invalidateQueries({ queryKey: ['departmentList'] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateDepartmentRequest) => updateDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departmentSettingList'] });
      queryClient.invalidateQueries({ queryKey: ['departmentList'] });
    },
  });
};
