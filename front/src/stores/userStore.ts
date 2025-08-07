// src/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
}

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  userId: string | null;
  nickname: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  checkAuth: () => void;

  setUserInfo: (userId: number, nickname: string) => void;
}

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      userId: null,
      nickname: null,
      // 로그인 시 토큰 저장 & 인증 상태 업데이트

      setToken: (token) => {
        const { exp } = jwtDecode<JwtPayload>(token);
        set({ token, isAuthenticated: true });
      },

      // 로그아웃 시 토큰 제거 & 인증 상태 업데이트
      clearToken: () => {
        set({
          token: null,
          isAuthenticated: false,
          userId: null,
          nickname: null,
        });
      },

      // 토큰 유효성 검사: 만료 시간(exp) 비교
      checkAuth: () => {
        const token = get().token;
        if (!token) return set({ isAuthenticated: false });
        try {
          const { exp } = jwtDecode<JwtPayload>(token);
          if (exp > Date.now() / 1000) {
            set({ isAuthenticated: true });
          } else {
            get().clearToken();
          }
        } catch {
          get().clearToken();
        }
      },
      setUserInfo: (userId, nickname) => {
        set({ userId: String(userId), nickname });
      },
    }),
    { name: 'user-storage' },
  ),
);
