export interface Note {
  noteId: number;
  userId: number;
  nickname: string;
  problemId: string;
  problemName: string;
  problemTier: number;
  noteTitle: string;
  content: string;
  successCode: string;
  successCodeStart: string;
  successCodeEnd: string;
  failCode: string;
  failCodeStart: string;
  failCodeEnd: string;
  viewCount: number;
  isPublic: boolean;
  createdAt: string;
}
<<<<<<< HEAD
=======

// note 생성 api에 전달되는 DTO
export interface noteGenerateRequestDTO {
  problemId: number;
  problemName: string;
  problemTier: number;
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
  isPublic: boolean;
  isLiked: boolean;
  isFollowing: boolean;
}

// AI 노트 생성 API에 전달할 DTO
export interface AIGenerateRequestDTO {
  problemId: number;
  problemName: string;
  problemTier: number;
  successCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  failCode: string;
  failCodeStart: number;
  failCodeEnd: number;
}
>>>>>>> front
