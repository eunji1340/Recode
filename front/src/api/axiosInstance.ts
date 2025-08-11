// src/api/axiosInstance.ts
import axios, { AxiosError } from 'axios';
import { useUserStore } from '../stores/userStore';

const REISSUE_PATH = '/users/reissue';

const api = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL, // API 기본 경로
  withCredentials: true, // ★ HttpOnly 쿠키 전송
});

// 무한루프 방지(요청 단위 1회만 재시도)
const retriedOnce = new WeakSet<object>();

// 요청 전: 만료 임박 선제 갱신 + Authorization 주입
api.interceptors.request.use(async (config) => {
  const { token, getAccessExp, refreshTokens } = useUserStore.getState();

  // 만료 임박(30초) 시 선제 갱신
  const exp = getAccessExp?.();
  if (exp) {
    const now = Math.floor(Date.now() / 1000);
    if (exp - now < 30) {
      try {
        const newAccess = await refreshTokens();
        (config.headers ??= {} as any);
        (config.headers as any).Authorization = `Bearer ${newAccess}`;
        return config;
      } catch {
        // 실패 시 응답에서 401 처리
      }
    }
  }

  // 기존 토큰 주입
  if (token) {
    (config.headers ??= {} as any);
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답: 401 → 재발급 → 1회 재시도
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original: any = error.config;

    if (!original || error.response?.status !== 401) {
      throw error;
    }

    // 재발급 요청 자체가 401이면 중단
    const urlPath = (original.url || '').toString();
    if (urlPath.includes(REISSUE_PATH)) {
      useUserStore.getState().clearToken();
      throw error;
    }

    // 이미 재시도한 요청이면 중단
    if (retriedOnce.has(original)) {
      useUserStore.getState().clearToken();
      throw error;
    }

    try {
      const newAccess = await useUserStore.getState().refreshTokens();
      retriedOnce.add(original);

      (original.headers ??= {} as any);
      (original.headers as any).Authorization = `Bearer ${newAccess}`;

      return api(original); // 1회 재시도
    } catch (e) {
      useUserStore.getState().clearToken();
      throw e;
    }
  }
);

export default api;
