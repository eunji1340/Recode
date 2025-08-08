import api from './axiosInstance';
import type {
  ApiFeed,
  ExploreFeedCardData,
  MainFeedData,
} from '@/types/feed';
import {
  mapApiFeedCardToMainFeedData,
  mapApiFeedCardToExploreData,
} from '../utils/mapApiFeed';

/**
 * 좋아요 추가 (POST)
 * @param noteId 오답노트 ID
 */
export const addLike = async (noteId: number) => {
  return await api.post(`/feeds/${noteId}/hearts`);
};

/**
 * 좋아요 삭제 (DELETE)
 * @param noteId 오답노트 ID
 */
export const removeLike = async (noteId: number) => {
  return await api.delete(`/feeds/${noteId}/hearts`);
};

/**
 * 팔로우 추가
 * @param followId - 팔로우할 유저의 ID
 */
export const addFollow = async (followId: number): Promise<void> => {
  await api.post(`/follow/${followId}`);
};

/**
 * 팔로우 취소
 * @param followId - 팔로우 해제할 유저의 ID
 */
export const removeFollow = async (followId: number): Promise<void> => {
  await api.delete(`/follow/${followId}`);
};

/**
 * ExplorePage에서 피드 목록을 불러오는 API 함수
 * - 검색 조건과 페이지 정보를 받아 서버에서 데이터를 요청
 *
 * @param page - 현재 페이지 번호
 * @param size - 한 페이지당 요청할 피드 개수
 * @param search - 공통 검색어
 * @param tag - 태그 필터링 목록
 * @param sort - 정렬 기준 (latest | likes | comments)
 * @param scope - 유저 범위 (all | following)
 * @returns items: 변환된 피드 데이터 배열, last: 마지막 페이지 여부
 */
export async function fetchExploreFeeds({
  page,
  size,
  search = '',
  tag = '',
  sort = 'latest',
  scope = 'all',
}: {
  page: number;
  size: number;
  search?: string;
  tag?: string;
  sort?: string;
  scope?: string;
}): Promise<{ items: ExploreFeedCardData[]; last: boolean }> {
  const res = await api.get('/feeds', {
    params: {
      page,
      size,
      search,
      tag,
      sort,
      scope,
    },
  });

  const apiFeeds: ApiFeed[] = res.data.data.details;

  return {
    items: apiFeeds.map(mapApiFeedCardToExploreData),
    last: res.data.data.last,
  };
}

/**
 * MainFeed 페이지에서 피드 목록을 불러오는 API 함수
 * - 검색 조건과 페이지 정보를 받아 서버에서 데이터를 요청
 *
 * @param page - 현재 페이지 번호
 * @param size - 한 페이지당 요청할 피드 개수
 * @param search - 공통 검색어
 * @param tag - 태그
 * @returns items: 변환된 피드 데이터 배열, last: 마지막 페이지 여부
 */
export async function fetchMainFeeds({
  page,
  size,
  search = '',
  tag = '',
}: {
  page: number;
  size: number;
  search?: string;
  tag?: string;
}): Promise<{ items: MainFeedData[]; last: boolean }> {
  const res = await api.get('/feeds/followings', {
    params: {
      page,
      size,
      search,
      tag,
    },
  });

  const apiFeeds: ApiFeed[] = res.data.data.details;

  return {
    items: apiFeeds.map(mapApiFeedCardToMainFeedData),
    last: res.data.data.last,
  };
}

/**
 * 특정 사용자의 오답노트 목록 조회
 */
export async function fetchUserFeeds({
  userId,
  page,
  size,
  search = '',
  tag = '',
}: {
  userId: number;
  page: number;
  size: number;
  search?: string;
  tag?: string;
}): Promise<{ items: ExploreFeedCardData[]; last: boolean }> {
  const res = await api.get(`/feeds/${userId}`, {
    params: {
      page,
      size,
      search,
      tag,
    },
  });

  const apiFeeds: ApiFeed[] = res.data.data.details;

  return {
    items: apiFeeds.map(mapApiFeedCardToExploreData),
    last: res.data.data.last,
  };
}

/**
 * 사용자가 좋아요한 노트 목록 조회
 */
export async function fetchLikedFeeds({
  userId,
  page,
  size,
  sortType,
  search = '',
  tag = '',
}: {
  userId: number;
  page: number;
  size: number;
  sortType: number;
  search?: string;
  tag?: string;
}): Promise<{ items: ExploreFeedCardData[]; last: boolean }> {
  const res = await api.get(`/feeds/${userId}/liked-notes`, {
    params: {
      page,
      size,
      sortType,
      search,
      tag,
    },
  });

  const apiFeeds = res.data.data.details;

  return {
    items: apiFeeds.map(mapApiFeedCardToExploreData),
    last: res.data.data.last,
  };
}