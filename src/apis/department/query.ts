import { useQuery } from '@tanstack/react-query';
import { getDepartmentList } from './api';
import { useDepartmentStore } from '@/store/useDepartmentStore';

export const useDepartmentList = () => {
  const { setDepartments } = useDepartmentStore();

  return useQuery({
    queryKey: ['departmentList'],
    queryFn: async () => {
      const response = await getDepartmentList();
      const departments = response.result?.departmentList || [];
      setDepartments(departments);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
