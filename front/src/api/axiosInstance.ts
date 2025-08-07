// src/api/axiosInstance.ts

import axios from 'axios';
import { useUserStore } from '../stores/userStore';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL, // API 기본 경로
});

// 모든 요청 전에 실행되는 인터셉터
api.interceptors.request.use(
  (config) => {
    // userStore 상태 받아오기
    const token = useUserStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 추가
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
