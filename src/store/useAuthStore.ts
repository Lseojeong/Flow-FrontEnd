import { create } from 'zustand';
import { getAdminProfile, postLogout, refreshToken } from '@/apis/auth/api';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  hasChecked: boolean;
  setIsLoggedIn: (_value: boolean) => void;
  checkLoginStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,
  hasChecked: false,

  setIsLoggedIn: (value) => set({ isLoggedIn: value }),

  checkLoginStatus: async () => {
    if (get().hasChecked) return;

    set({ isLoading: true });
    try {
      await getAdminProfile();
      set({ isLoggedIn: true });
    } catch {
      try {
        await refreshToken();
        await getAdminProfile();
        set({ isLoggedIn: true });
      } catch {
        set({ isLoggedIn: false });
      }
    } finally {
      set({ isLoading: false, hasChecked: true });
    }
  },

  logout: async () => {
    try {
      await postLogout?.();
    } finally {
      localStorage.removeItem('csrfToken');
      set({ isLoggedIn: false, hasChecked: false });
    }
  },
}));
