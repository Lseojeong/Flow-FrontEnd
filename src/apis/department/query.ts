import { useQuery } from '@tanstack/react-query';
import { getDepartmentList, getDepartmentSettingList } from './api';
import { useDepartmentStore } from '@/store/useDepartmentStore';
import type { DepartmentSetting } from './type';

export const useDepartmentList = () => {
  const { setDepartments } = useDepartmentStore();

  return useQuery({
    queryKey: ['departmentList'],
    queryFn: async () => {
      const response = await getDepartmentList();
      const departments = response.data?.result?.departmentList || [];
      setDepartments(departments);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useDepartmentSettingList = () => {
  return useQuery({
    queryKey: ['departmentSettingList'],
    queryFn: async () => {
      const response = await getDepartmentSettingList();
      const departments: DepartmentSetting[] = (response.result?.departmentList || []).map((d) => ({
        departmentId: d.departmentId,
        departmentName: d.departmentName,
        adminCount: typeof d.adminCount === 'string' ? Number(d.adminCount) : d.adminCount,
        categoryCount:
          typeof d.categoryCount === 'string' ? Number(d.categoryCount) : d.categoryCount,
      }));
      return { ...response, result: { ...response.result, departmentList: departments } };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
