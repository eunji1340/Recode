import type { ApiFeed, ExploreFeedCardData, MainFeedData } from '../types/feed';

/**
 * ApiFeedCard → ExploreFeedCardData로 변환하는 매핑 함수
 * ExplorePage에서 카드 형태로 사용할 때 사용
 *
 * @param apiFeed - 백엔드 API에서 받은 피드 데이터
 * @returns ExploreFeedCardData - 탐색 카드에서 사용하는 데이터 구조
 */
export function mapApiFeedCardToExploreData(apiFeed: ApiFeed): ExploreFeedCardData {
  return {
    noteId: apiFeed.noteId,
    noteTitle: apiFeed.noteTitle,
    successLanguage: apiFeed.successLanguage,
    isPublic: apiFeed.isPublic,
    createdAt: apiFeed.createdAt,
    viewCount: apiFeed.viewCount,
    likeCount: apiFeed.likeCount,
    commentCount: apiFeed.commentCount,
    user: {
      userId: apiFeed.user.userId,
      bojId: apiFeed.user.bojId,
      nickname: apiFeed.user.nickname,
      userTier: apiFeed.user.userTier,
      image: apiFeed.user.image,
    },
    problem: {
      problemId: apiFeed.problem.problemId,
      problemName: apiFeed.problem.problemName,
      problemTier: apiFeed.problem.problemTier,
    },
    tags: apiFeed.tags.map((tag) => tag.tagName),
    deleted: apiFeed.deleted,
    liked: apiFeed.liked,
    following: apiFeed.following,
  };
}

/**
 * ApiFeedCard → MainFeedData 변환 함수
 * MainFeedPage에서 카드 표시를 위해 필요한 필드만 가공
 */
export function mapApiFeedCardToMainFeedData(apiFeed: ApiFeed): MainFeedData {
  return {
    noteId: apiFeed.noteId,
    noteTitle: apiFeed.noteTitle,
    content: apiFeed.content,
    successCode: apiFeed.successCode,
    successCodeStart: apiFeed.successCodeStart,
    successCodeEnd: apiFeed.successCodeEnd,
    successLanguage: apiFeed.successLanguage,
    failCode: apiFeed.failCode,
    failCodeStart: apiFeed.failCodeStart,
    failCodeEnd: apiFeed.failCodeEnd,
    failLanguage: apiFeed.failLanguage,
    isPublic: apiFeed.isPublic,
    createdAt: apiFeed.createdAt,
    updatedAt: apiFeed.updatedAt,
    viewCount: apiFeed.viewCount,
    likeCount: apiFeed.likeCount,
    commentCount: apiFeed.commentCount,
    user: {
      userId: apiFeed.user.userId,
      bojId: apiFeed.user.bojId,
      nickname: apiFeed.user.nickname,
      userTier: apiFeed.user.userTier,
      image: apiFeed.user.image,
    },
    problem: {
      problemId: apiFeed.problem.problemId,
      problemName: apiFeed.problem.problemName,
      problemTier: apiFeed.problem.problemTier,
    },
    tags: apiFeed.tags.map((tag) => tag.tagName),
    deleted: apiFeed.deleted,
    liked: apiFeed.liked,
    following: apiFeed.following,
  };
}