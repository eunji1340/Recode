import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

// zustand로 전역 토큰 상태 관리
export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      token: null, // 초기값: 토큰 없음
      setToken: (token) => set({ token }), // 토큰 설정 함수
      clearToken: () => set({ token: null }), // 토큰 삭제 함수
    }),
    {
      name: "user-storage", // localStorage에 저장될 때 사용될 키
    }
  )
);