// src/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const REISSUE_PATH = '/users/reissue';

interface JwtPayload {
  exp: number; userId?: string; nickname?: string;
}

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  userId: string | null;
  nickname: string | null;

  setToken: (token: string) => void;
  clearToken: () => void;
  setUserInfo: (userId: number | string, nickname: string) => void;

  // 이미 있으시면 유지
  getAccessExp?: () => number | null;
  refreshTokens?: () => Promise<string>;
  refreshFailed?: boolean;

  // [추가] 토큰만으로 현재 인증 상태를 동기 체크
  checkAuth: () => boolean;
}

// 로그인/재발급 전용 인스턴스 (이미 있으면 유지)
const authApi = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL,
  withCredentials: true,
});

let refreshing: Promise<string> | null = null;

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      userId: null,
      nickname: null,
      refreshFailed: false,

      setToken: (token) => {
        set({ token, isAuthenticated: true });
      },
      clearToken: () => {
        set({ token: null, isAuthenticated: false, userId: null, nickname: null });
      },
      setUserInfo: (userId, nickname) => {
        set({ userId: String(userId), nickname });
      },

      getAccessExp: () => {
        const t = get().token;
        if (!t) return null;
        try {
          const { exp } = jwtDecode<JwtPayload>(t);
          return exp ?? null;
        } catch {
          return null;
        }
      },

      refreshTokens: async () => {
        const { refreshFailed } = get();
        if (refreshFailed) return Promise.reject(new Error('refresh already failed'));
        if (refreshing) return refreshing;

        refreshing = authApi.post(REISSUE_PATH, null)
          .then((res) => {
            const data = res.data?.data ?? res.data;
            const newAccess = data?.accessToken;
            if (!newAccess) throw new Error('no accessToken');
            set({ token: newAccess, isAuthenticated: true, refreshFailed: false });
            return newAccess;
          })
          .catch((e) => {
            set({ refreshFailed: true });
            get().clearToken();
            throw e;
          })
          .finally(() => { refreshing = null; });

        return refreshing;
      },


      checkAuth: () => {
        const t = get().token;
        if (!t) { set({ isAuthenticated: false }); return false; }
        try {
          const { exp } = jwtDecode<JwtPayload>(t);
          const now = Math.floor(Date.now() / 1000);
          const ok = typeof exp === 'number' ? exp > now : false;
          set({ isAuthenticated: ok });
          return ok;
        } catch {
          set({ isAuthenticated: false });
          return false;
        }
      },
    }),
    { name: 'user-store' }
  )
);
