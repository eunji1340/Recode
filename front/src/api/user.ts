// src/api/user.ts
import api from './axiosInstance';
import type { UserProfile } from '../types/user';
import type { TagCount } from '../pages/mypage/dashboard/StatsSection';
import type { DailyCount } from '../utils/date';
import type { FollowDetail } from '../pages/mypage/dashboard/FollowModal';
import { useUserStore } from '../stores/userStore';

/**
 * 로그인한 사용자의 프로필 정보를 가져옵니다.
 * 이 함수는 useUserStore의 userId에 의존합니다.
 * @returns 로그인한 사용자의 프로필 정보
 */
export const fetchMyInfo = async (): Promise<UserProfile> => {
  const { userId } = useUserStore.getState();
  if (!userId) throw new Error('User not logged in');

  const { data } = await api.get<UserProfile>(`/users/${userId}`);
  return data;
};

/**
 * 회원 탈퇴를 처리합니다.
 * @param userId - 탈퇴할 사용자의 ID
 * @returns API 응답 데이터
 */
export const deleteUser = async (userId: string | number) => {
  const { data } = await api.delete(`/users/${userId}`);
  return data;
};

/**
 * 닉네임을 업데이트합니다.
 * @param userId - 업데이트할 사용자의 ID
 * @param nickname - 새 닉네임
 */
export const updateNickname = async (userId: number, nickname: string) => {
  const res = await api.put(`/users/${userId}/nickname`, {
    nickname: nickname.trim(),
  });
  if (res.status !== 200) throw new Error('닉네임 변경에 실패했습니다.');
};

/**
 * 닉네임 중복을 확인합니다.
 * @param nickname - 확인할 닉네임
 * @returns 중복 여부
 */
export const checkNicknameDuplicate = async (nickname: string) => {
  const { data } = await api.post('/users/nickname_dupcheck', {
    nickname: nickname.trim(),
  });
  return data as { data: boolean };
};

/**
 * 비밀번호 변경 API
 * @param userId - 변경할 유저의 ID
 * @param currPassword - 현재 비밀번호
 * @param newPassword - 새 비밀번호
 */
export const updatePassword = async (
  userId: number,
  currPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.put(`/users/${userId}/password`, {
      currPassword,
      newPassword,
    });
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    throw error;
  }
};

/**
 * 이메일을 업데이트합니다.
 * @param userId - 업데이트할 사용자의 ID
 * @param email - 새 이메일
 */
export const updateEmail = async (userId: number, email: string): Promise<void> => {
  try {
    await api.put(`/users/${userId}/email`, {
      email,
    });
  } catch (error) {
    console.error('이메일 변경 실패:', error);
    throw error;
  }
};

/**
 * 한마디를 업데이트합니다.
 * @param userId - 업데이트할 사용자의 ID
 * @param bio - 새 한마디
 */
export const updateBio = async (userId: number, bio: string): Promise<void> => {
  try {
    await api.put(`/users/${userId}/bio`, {
      bio: bio.trim(),
    });
  } catch (error) {
    console.error('한마디 변경 실패:', error);
    throw error;
  }
};

/**
 * 특정 사용자의 프로필 정보를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 사용자의 프로필 정보
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data } = await api.get<UserProfile>(`/users/${userId}`);
  return data;
};

/**
 * 특정 사용자가 작성한 총 노트 개수를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 총 노트 개수
 */
export const fetchUserNoteCount = async (userId: string): Promise<number> => {
  const { data } = await api.get<number>(`/notes/note-count?userId=${userId}`);
  return data;
};

/**
 * 특정 사용자의 팔로워 수를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 팔로워 수
 */
export const fetchUserFollowerCount = async (userId: string): Promise<number> => {
  const { data } = await api.get<number>(`/follow/followers/count/${userId}`);
  return data;
};

/**
 * 특정 사용자의 팔로잉 수를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 팔로잉 수
 */
export const fetchUserFollowingCount = async (userId: string): Promise<number> => {
  const { data } = await api.get<number>(`/follow/followings/count/${userId}`);
  return data;
};

/**
 * 특정 사용자의 팔로우 상세 목록을 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @param tab - 'followers' 또는 'followings' 탭
 * @returns 팔로우 상세 목록 배열
 */
export const fetchFollowDetails = async (
  userId: string,
  tab: 'followers' | 'followings'
): Promise<FollowDetail[]> => {
  const endpoint =
    tab === 'followers'
      ? `/follow/followers/${userId}`
      : `/follow/followings/${userId}`;

  const { data } = await api.get<{ data: { details: FollowDetail[] } }>(endpoint);
  return data.data.details;
};

/**
 * 특정 사용자의 태그별 노트 통계를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 태그별 통계 배열
 */
export const fetchUserTagCounts = async (userId: string): Promise<TagCount[]> => {
  const { data } = await api.get<TagCount[]>(`/notes/note-count-tag?userId=${userId}`);
  return data;
};

/**
 * 특정 사용자의 일자별 노트 개수 데이터를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 일자별 노트 개수 배열
 */
export const fetchUserDailyNoteCounts = async (userId: string): Promise<DailyCount[]> => {
  const { data } = await api.get<DailyCount[]>(`/notes/note-count-date?userId=${userId}`);
  return data;
};

/**
 * 특정 사용자의 현재 연속 스트릭 일수를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 현재 스트릭 일수
 */
export const fetchUserCurrentStreak = async (userId: string): Promise<number> => {
  const { data } = await api.get<number>(`/notes/note-streak?userId=${userId}`);
  return data;
};

/**
 * 특정 사용자의 최대 스트릭 일수를 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 최대 스트릭 일수
 */
export const fetchUserMaxStreak = async (userId: string): Promise<number> => {
  const { data } = await api.get<number>(`/notes/max-streak?userId=${userId}`);
  return data;
};

export interface UserDashboardData extends UserProfile {
  followerCount: number;
  followingCount: number;
  noteCount: number;
}

/**
 * 특정 사용자의 대시보드에 필요한 모든 정보를 한 번에 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 프로필, 팔로워/팔로잉 수, 총 노트 개수 등 대시보드 데이터
 */
export async function fetchAllUserDashboardData(userId: string): Promise<UserDashboardData> {
  const [userRes, noteCount, followerCount, followingCount] = await Promise.all([
    fetchUserProfile(userId),
    fetchUserNoteCount(userId),
    fetchUserFollowerCount(userId),
    fetchUserFollowingCount(userId),
  ]);

  return {
    ...userRes,
    noteCount,
    followerCount,
    followingCount,
  };
}

/**
 * 특정 사용자의 스트릭 관련 모든 데이터를 한 번에 가져옵니다.
 * @param userId - 조회할 사용자의 ID
 * @returns 현재 스트릭, 최대 스트릭, 일자별 노트 개수 데이터
 */
export async function fetchAllUserStreakData(userId: string): Promise<{
  todayStreak: number;
  maxStreak: number;
  dailyRows: DailyCount[];
}> {
  const [todayStreak, maxStreak, dailyRows] = await Promise.all([
    fetchUserCurrentStreak(userId),
    fetchUserMaxStreak(userId),
    fetchUserDailyNoteCounts(userId),
  ]);

  return {
    todayStreak,
    maxStreak,
    dailyRows: dailyRows || [],
  };
}