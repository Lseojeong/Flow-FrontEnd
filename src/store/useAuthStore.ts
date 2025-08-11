import { create } from 'zustand';
import { getAdminProfile, postLogout, postAdminLogin, refreshToken } from '@/apis/auth/api';
import type { AdminProfile, LoginRequest } from '@/apis/auth/types';

declare global {
  interface Window {
    showToast?: (_message: string) => void;
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

let refreshTimer: number | null = null;
let isRefreshing = false;

function setCsrfToken(csrfToken?: string) {
  if (csrfToken) {
    localStorage.setItem('csrfToken', csrfToken);
  }
}

async function refreshNow() {
  if (isRefreshing) return;
  isRefreshing = true;
  try {
    const res = await refreshToken();
    const headerCsrf = res.headers['x-csrf-token'] as string | undefined;
    const bodyCsrf = res.data.result?.csrfToken;
    const newCsrf = bodyCsrf ?? headerCsrf;
    setCsrfToken(newCsrf);
  } finally {
    isRefreshing = false;
  }
}

function schedulePeriodicRefresh(intervalMs = 25 * 60 * 1000) {
  if (refreshTimer) {
    window.clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  refreshTimer = window.setTimeout(async () => {
    await refreshNow();
    schedulePeriodicRefresh(intervalMs);
  }, intervalMs);
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
      schedulePeriodicRefresh();
    } catch {
      try {
        await refreshNow();
        const profile = await getAdminProfile();
        set({ isLoggedIn: true, profile });
        schedulePeriodicRefresh();
      } catch {
        set({ isLoggedIn: false, profile: null });
      }
    } finally {
      set({ isLoading: false, hasChecked: true });
    }
  },

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      await postAdminLogin(data);
      const profile = await getAdminProfile();
      set({ isLoggedIn: true, profile, hasChecked: true, isLoading: false });
    } catch (error) {
      set({ isLoggedIn: false, profile: null, hasChecked: true, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    localStorage.removeItem('csrfToken');
    if (refreshTimer) {
      window.clearTimeout(refreshTimer);
      refreshTimer = null;
    }
    set({ isLoggedIn: false, hasChecked: true, profile: null, isLoading: false });

    try {
      await postLogout();
    } catch {
      window.showToast?.('로그아웃 중 오류가 발생했습니다.');
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
}));
