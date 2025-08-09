/**
 * 백엔드에서 받아오는 API 피드 데이터 원형
 */
export interface ApiFeed {
  noteId: number;
  noteTitle: string;
  content: string;
  successCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  successLanguage: string;
  failCode: string;
  failCodeStart: number;
  failCodeEnd: number;
  failLanguage: string;
  isPublic: boolean,
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  user: {
    userId: number;
    bojId: string;
    nickname: string;
    userTier: number;
    image?: string;
  };
  problem: {
    problemId: number;
    problemName: string;
    problemTier: number;
  };
  tags: {
    tagId: number;
    tagName: string;
  }[];
  deleted: boolean,
  liked: boolean;
  following: boolean;
}

/**
 * 메인 피드 페이지에서 사용하는 전체 데이터 구조
 */
export interface MainFeedData {
  noteId: number;
  noteTitle: string;
  content: string;
  successCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  successLanguage: string;
  failCode: string;
  failCodeStart: number;
  failCodeEnd: number;
  failLanguage: string;
  isPublic: boolean,
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  user: {
    userId: number;
    bojId: string;
    nickname: string;
    userTier: number;
    image?: string;
  };
  problem: {
    problemId: number;
    problemName: string;
    problemTier: number;
  };
  tags: string[];
  deleted: boolean;
  liked: boolean;
  following: boolean;
}

/**
 * 탐색 페이지 피드 카드 구조
 */
export interface ExploreFeedCardData {
  noteId: number;
  noteTitle: string;
  successLanguage: string;
  isPublic: boolean,
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  user: {
    userId: number;
    bojId: string;
    nickname: string;
    userTier: number;
    image?: string;
  };
  problem: {
    problemId: number;
    problemName: string;
    problemTier: number;
  };
  tags: string[];
  deleted: boolean;
  liked: boolean;
  following: boolean;
}

/**
 * 피드 정렬 옵션
 */
export type SortOption = 'latest' | 'views' | 'likes' | 'comments';
