/**
 * 백엔드에서 받아오는 API 피드 데이터 원형
 */
export interface ApiFeedCard {
  noteId: number;
  noteTitle: string | null;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  following: boolean;
  successCode: string;
  failCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  failCodeStart: number;
  failCodeEnd: number;
  successLanguage: string;
  failLanguage: string;
  user: {
    userId: number;
    nickname: string;
    bojId: string;
    userTier: number;
  };
  problem: {
    problemId: number;
    problemName: string;
    problemTier: number;
    problemLanguage?: string;
  };
  tags: {
    tagId: number;
    tagName: string;
  }[];
}

/**
 * 메인 피드 페이지에서 사용하는 전체 데이터 구조
 */
export interface MainFeedData {
  noteId: number;
  noteTitle: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isFollowing: boolean;

  successCode: string;
  failCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  failCodeStart: number;
  failCodeEnd: number;

  user: {
    userId: number;
    nickname: string;
    image?: string;
  };

  problem: {
    problemId: number;
    problemName: string;
    problemTier: number;
    problemLanguage?: string;
  };

  tags: string[]; // tagName만 사용
}

/**
 * 탐색 페이지 피드 카드 구조
 */
export interface ExploreFeedCardData {
  noteId: number;
  noteTitle: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isFollowing: boolean;

  user: {
    userId: number;
    nickname: string;
    image?: string;
  };

  problem: {
    problemId: number;
    problemName: string;
    problemTier: number;
    problemLanguage?: string;
  };

  tags: string[];
}

/**
 * 피드 정렬 옵션
 */
export type SortOption = 'latest' | 'views' | 'likes' | 'comments';
