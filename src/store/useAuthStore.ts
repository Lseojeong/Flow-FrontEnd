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

let refreshTimer: number | null = null;
let isRefreshing = false;

// csrfToken 저장
function setCsrfToken(csrfToken?: string) {
  if (csrfToken) {
    localStorage.setItem('csrfToken', csrfToken);
  }
}

// 리프레시 실행(중복 방지)
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

// 일정 주기로 리프레시 예약 (예: 25분마다)
function schedulePeriodicRefresh(intervalMs = 25 * 60 * 1000) {
  if (refreshTimer) {
    window.clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  refreshTimer = window.setTimeout(async () => {
    await refreshNow();
    schedulePeriodicRefresh(intervalMs); // 다시 예약
  }, intervalMs);
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
      // ✅ 주기적 리프레시 예약
      schedulePeriodicRefresh();
    } catch {
      try {
        await refreshNow();
        await getAdminProfile();
        set({ isLoggedIn: true });
        schedulePeriodicRefresh();
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
      if (refreshTimer) {
        window.clearTimeout(refreshTimer);
        refreshTimer = null;
      }
      set({ isLoggedIn: false, hasChecked: false });
    }
  },
}));
