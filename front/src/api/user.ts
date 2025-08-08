import api from './axiosInstance';
import type { UserProfile } from '../types/user';
import { useUserStore } from '../stores/userStore';

export const fetchMyInfo = async (): Promise<UserProfile> => {
  const { userId } = useUserStore.getState();

  if (!userId) {
    throw new Error('User not logged in');
  }

  const response = await api.get<UserProfile>(`/users/${userId}`);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};