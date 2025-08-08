import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDepartments } from './api';
import type { CreateDepartmentsRequest } from './type';

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
