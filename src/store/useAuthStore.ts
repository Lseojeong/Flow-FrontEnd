import { create } from 'zustand';
import { getAdminProfile, postLogout } from '@/apis/auth/api';
import type { AdminProfile } from '@/apis/auth/types';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  hasChecked: boolean;
  profile: AdminProfile | null;
  setIsLoggedIn: (_value: boolean) => void;
  setProfile: (_profile: AdminProfile | null) => void;
  checkLoginStatus: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,
  hasChecked: false,
  profile: null,

  setIsLoggedIn: (value) => set({ isLoggedIn: value }),
  setProfile: (profile) => set({ profile }),

  checkLoginStatus: async () => {
    if (get().hasChecked) return;
    set({ isLoading: true });

    try {
      const profile = await getAdminProfile();
      set({ isLoggedIn: true, profile });
    } catch {
      set({ isLoggedIn: false, profile: null });
    } finally {
      set({ isLoading: false, hasChecked: true });
    }
  },

  logout: async () => {
    // 즉시 UI 상태 변경
    localStorage.removeItem('csrfToken');
    set({ isLoggedIn: false, hasChecked: false, profile: null, isLoading: false });

    // 백그라운드에서 서버 로그아웃 호출 (에러 무시)
    try {
      await postLogout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    // 즉시 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.replace('/');
    }
  },
}));
