import { create } from 'zustand';
import { getAdminProfile, postLogout, postAdminLogin } from '@/apis/auth/api';
import type { AdminProfile, LoginRequest } from '@/apis/auth/types';

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
    } catch (error) {
      console.warn('Profile check failed:', error);
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
      throw error; // 에러를 다시 던져서 컴포넌트에서 처리할 수 있도록
    }
  },

  logout: async () => {
    // 즉시 UI 상태 변경
    localStorage.removeItem('csrfToken');
    set({ isLoggedIn: false, hasChecked: true, profile: null, isLoading: false });

    // 백그라운드에서 서버 로그아웃 호출 (에러 무시)
    try {
      await postLogout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    // 즉시 홈페이지로 리다이렉트
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
}));
