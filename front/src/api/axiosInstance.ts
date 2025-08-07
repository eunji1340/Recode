// src/api/axiosInstance.ts

import axios from 'axios';
import qs from 'qs';
import { useUserStore } from '../stores/userStore';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: import.meta.env.VITE_REST_API_URL, // API 기본 경로
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: 'repeat' }),
});

// 모든 요청 전에 실행되는 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token; // zustand에서 토큰 꺼냄
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 추가
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
