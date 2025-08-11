// src/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosInstance'

interface JwtPayload {
  exp: number; // seconds
  [k: string]: any;
}

interface UserState {
  token: string | null;              // access only
  isAuthenticated: boolean;
  userId: string | null;
  nickname: string | null;

  // 동시 재발급 방지
  isRefreshing: boolean;
  refreshPromise: Promise<string> | null;

  setToken: (token: string) => void;
  clearToken: () => void;
  checkAuth: () => void;
  setUserInfo: (userId: number | string, nickname: string) => void;

  getAccessExp: () => number | null;
  refreshTokens: () => Promise<string>;
}

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      userId: null,
      nickname: null,

      isRefreshing: false,
      refreshPromise: null,

      setToken: (token) => {
        try { jwtDecode<JwtPayload>(token); } catch {}
        set({ token, isAuthenticated: true });
      },

      clearToken: () => {
        set({
          token: null,
          isAuthenticated: false,
          userId: null,
          nickname: null,
          isRefreshing: false,
          refreshPromise: null,
        });
      },

      checkAuth: () => {
        const exp = get().getAccessExp();
        if (exp && exp > Date.now() / 1000) {
          set({ isAuthenticated: true });
        } else {
          get().clearToken();
        }
      },

      setUserInfo: (userId, nickname) => {
        set({ userId: String(userId), nickname });
      },

      getAccessExp: () => {
        const t = get().token;
        if (!t) return null;
        try {
          const { exp } = jwtDecode<JwtPayload>(t);
          return typeof exp === 'number' ? exp : null;
        } catch {
          return null;
        }
      },

      //  쿠키 기반 재발급
      refreshTokens: async () => {
        const state = get();
        if (state.isRefreshing && state.refreshPromise) {
          return state.refreshPromise; // 단일 비행 (이미 진행 중이면 그 결과를 함께 사용)
        }

        const doRefresh = async () => {
          // api 인스턴스를 사용하면 baseURL이 env에 따라 자동 적용됨
          const res = await api.post('/users/reissue', null, {
            withCredentials: true, // 쿠키 전송
          });
;
          const newAccess =
            res.data?.data?.accessToken ?? res.data?.accessToken ?? null;
          if (!newAccess) throw new Error('No access token in reissue response');

          get().setToken(newAccess);
          return newAccess as string;
        };

        const p = doRefresh()
          .catch((e) => {
            get().clearToken();
            throw e;
          })
          .finally(() => set({ isRefreshing: false, refreshPromise: null }));

        set({ isRefreshing: true, refreshPromise: p });
        return p;
      },
    }),
    { name: 'user-storage' },
  ),
);
