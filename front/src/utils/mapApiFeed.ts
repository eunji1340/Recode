import type { ApiFeedCard, ExploreFeedCardData, MainFeedData } from '../types/feed';

/**
 * ApiFeedCard → ExploreFeedCardData로 변환하는 매핑 함수
 * ExplorePage에서 카드 형태로 사용할 때 사용
 *
 * @param apiFeed - 백엔드 API에서 받은 피드 데이터
 * @returns ExploreFeedCardData - 탐색 카드에서 사용하는 데이터 구조
 */
export function mapApiFeedCardToExploreData(apiFeed: ApiFeedCard): ExploreFeedCardData {
  return {
    noteId: apiFeed.noteId,
    noteTitle: apiFeed.noteTitle ?? '제목 없음',
    createdAt: apiFeed.createdAt,
    likeCount: apiFeed.likeCount,
    commentCount: apiFeed.commentCount,
    isLiked: apiFeed.liked,
    isFollowing: apiFeed.following,

    user: {
      userId: apiFeed.user.userId,
      nickname: apiFeed.user.nickname,
      image: undefined, // TODO: 추후 API에서 이미지 필드 추가되면 반영
    },

    problem: {
      problemId: apiFeed.problem.problemId,
      problemName: apiFeed.problem.problemName,
      problemTier: apiFeed.problem.problemTier,
    },

    tags: apiFeed.tags.map((tag) => tag.tagName),
  };
}

/**
 * ApiFeedCard → MainFeedData 변환 함수
 * MainFeedPage에서 카드 표시를 위해 필요한 필드만 가공
 */
export function mapApiFeedCardToMainFeedData(apiFeed: ApiFeedCard): MainFeedData {
  return {
    noteId: apiFeed.noteId,
    noteTitle: apiFeed.noteTitle ?? '제목 없음',
    content: apiFeed.content,
    createdAt: apiFeed.createdAt,
    likeCount: apiFeed.likeCount,
    commentCount: apiFeed.commentCount,
    isLiked: apiFeed.liked,
    isFollowing: apiFeed.following,

    successCode: apiFeed.successCode,
    failCode: apiFeed.failCode,
    successCodeStart: apiFeed.successCodeStart,
    successCodeEnd: apiFeed.successCodeEnd,
    failCodeStart: apiFeed.failCodeStart,
    failCodeEnd: apiFeed.failCodeEnd,

    user: {
      userId: apiFeed.user.userId,
      nickname: apiFeed.user.nickname,
      image: undefined, // 아직 API에 이미지 없음
    },

    problem: {
      problemId: apiFeed.problem.problemId,
      problemName: apiFeed.problem.problemName,
      problemTier: apiFeed.problem.problemTier,
      problemLanguage: apiFeed.problem.problemLanguage,
    },

    tags: apiFeed.tags.map((tag) => tag.tagName),
  };
}