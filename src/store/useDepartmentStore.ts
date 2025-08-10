import { create } from 'zustand';
import { Department } from '@/apis/department/type';

interface DepartmentState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
  setDepartments: (_departments: Department[]) => void;
  setLoading: (_loading: boolean) => void;
  setError: (_error: string | null) => void;
  reset: () => void;
}

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: [],
  isLoading: false,
  error: null,

  setDepartments: (departments) => set({ departments }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  reset: () => set({ departments: [], isLoading: false, error: null }),
}));
