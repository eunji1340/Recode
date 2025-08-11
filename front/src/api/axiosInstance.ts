import axios, { AxiosError } from 'axios';
import { useUserStore } from '../stores/userStore';

const REISSUE_PATH = '/users/reissue';

const api = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL, // env 기반
  withCredentials: true, // 쿠키 전송
});

const retriedOnce = new WeakSet<object>();
const isAuthExpired = (s?: number) => s === 401 || s === 403 || s === 419;

// 요청 인터셉터: reissue 우회 + 만료 임박 선제 갱신 + Authorization 주입
api.interceptors.request.use(async (config) => {
  const url = (config.url || '').toString();
  if (url.includes(REISSUE_PATH)) {
    // reissue 호출은 절대 손대지 않음(순환/헤더오염 방지)
    return config;
  }

  const { token, getAccessExp, refreshTokens } = useUserStore.getState();

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
        // 실패 시 응답 인터셉터에서 처리
      }
    }
  }

  if (token) {
    (config.headers ??= {} as any);
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 만료(401/403/419) → reissue → 1회 재시도
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original: any = error.config;
    const status = error?.response?.status;

    if (!original || !isAuthExpired(status)) throw error;

    const urlPath = (original.url || '').toString();
    if (urlPath.includes(REISSUE_PATH)) {
      useUserStore.getState().clearToken();
      throw error;
    }

    if (retriedOnce.has(original)) {
      useUserStore.getState().clearToken();
      throw error;
    }

    try {
      const newAccess = await useUserStore.getState().refreshTokens();
      retriedOnce.add(original);

      (original.headers ??= {} as any);
      (original.headers as any).Authorization = `Bearer ${newAccess}`;

      return api(original);
    } catch (e) {
      useUserStore.getState().clearToken();
      throw e;
    }
  }
);

export default api;
export { REISSUE_PATH };
