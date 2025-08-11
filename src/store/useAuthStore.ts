import { create } from 'zustand';
import { getAdminProfile, postLogout, postAdminLogin } from '@/apis/auth/api';
import type { AdminProfile, LoginRequest } from '@/apis/auth/types';

declare global {
  interface Window {
    showToast?: (_message: string) => void;
    showErrorToast?: (_message: string) => void;
  }
}

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  hasChecked: boolean;
  profile: AdminProfile | null;
  setIsLoggedIn: (_value: boolean) => void;
  setProfile: (_profile: AdminProfile | null) => void;
  checkLoginStatus: () => Promise<void>;
  login: (_data: LoginRequest) => Promise<void>;
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
      set({
        isLoggedIn: false,
        profile: null,
        isLoading: false,
        hasChecked: true,
      });
    } finally {
      set({ isLoading: false, hasChecked: true });
    }
  },

  login: async (data: LoginRequest) => {
    set({ isLoading: true });

    try {
      // 1. 로그인 API 호출 (CSRF 토큰 설정 포함)
      await postAdminLogin(data);

      // 2. 로그인 성공 후 프로필 조회
      const profile = await getAdminProfile();

      // 3. 상태 업데이트
      set({
        isLoggedIn: true,
        profile,
        hasChecked: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoggedIn: false,
        profile: null,
        hasChecked: true,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem('csrfToken');
    set({ isLoggedIn: false, hasChecked: true, profile: null, isLoading: false });

    try {
      await postLogout();
    } catch {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast('로그아웃 중 오류가 발생했습니다.');
      }
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
}));
