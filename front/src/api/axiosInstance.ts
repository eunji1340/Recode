// src/api/axiosInstance.ts
import axios, { AxiosError } from 'axios';
import { useUserStore } from '../stores/userStore';

const REISSUE_PATH = '/users/reissue';
const LOGIN_PATH = '/users/login';

const api = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL,
  withCredentials: true,
});

const retriedOnce = new WeakSet<object>();

api.interceptors.request.use(async (config) => {
  const { token, getAccessExp, refreshTokens, refreshFailed } = useUserStore.getState();

  // [보강] 경로 판별을 좀 더 안전하게
  const pathname = (() => {
    try { return new URL(config.url!, api.defaults.baseURL).pathname; }
    catch { return config.url || ''; }
  })();
  const isAuthPath = pathname === LOGIN_PATH || pathname === REISSUE_PATH;

  if (isAuthPath) return config;

  // [보강] 리프레시가 이미 실패했으면 더 이상 선제갱신/인증 시도 안 함
  if (refreshFailed) return config;

  // 토큰 없으면 패스
  if (!token) return config;

  // [유지] 만료 임박 선제 갱신
  const exp = getAccessExp?.();
  if (exp) {
    const now = Math.floor(Date.now() / 1000);
    if (exp - now < 30) {
      try {
        const newAccess = await refreshTokens!();
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${newAccess}`;
      } catch {
        // 선제 갱신 실패 → 응답 인터셉터에서 최종 처리
      }
    }
  }

  // Authorization 주입
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const { refreshTokens, refreshFailed } = useUserStore.getState();

    const cfg = error.config;
    const status = error.response?.status;
    const url = cfg?.url || '';

    // [유지] 로그인/재발급 자체는 건드리지 않음
    if (!cfg || url.includes(LOGIN_PATH) || url.includes(REISSUE_PATH)) {
      return Promise.reject(error);
    }

    // [보강] 이미 리프레시 실패해 잠금된 상태면 재시도하지 않음
    if (refreshFailed) {
      return Promise.reject(error);
    }

    // [유지] 401일 때만 재발급 시도
    if (status === 401) {
      if (retriedOnce.has(cfg)) return Promise.reject(error);
      retriedOnce.add(cfg);

      try {
        const newAccess = await refreshTokens!();
        cfg.headers = cfg.headers ?? {};
        (cfg.headers as any).Authorization = `Bearer ${newAccess}`;
        return api(cfg); // 원 요청 재시도
      } catch (e) {
        return Promise.reject(e);
      }
    }

    // [유지] 403 포함 나머지는 그대로 실패
    return Promise.reject(error);
  }
);

export default api;
