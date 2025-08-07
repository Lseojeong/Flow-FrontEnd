import { create } from 'zustand';
import { getAdminProfile } from '@/apis/auth/api';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (_value: boolean) => void;
  checkLoginStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value) => set({ isLoggedIn: value }),

  checkLoginStatus: async () => {
    try {
      await getAdminProfile();
      set({ isLoggedIn: true });
    } catch {
      set({ isLoggedIn: false });
    }
  },
}));
