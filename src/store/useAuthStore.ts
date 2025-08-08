import { create } from 'zustand';
import { getAdminProfile } from '@/apis/auth/api';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  setIsLoggedIn: (_value: boolean) => void;
  checkLoginStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  isLoading: true,

  setIsLoggedIn: (value) => set({ isLoggedIn: value }),

  checkLoginStatus: async () => {
    set({ isLoading: true });
    try {
      await getAdminProfile();
      set({ isLoggedIn: true });
    } catch {
      set({ isLoggedIn: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
