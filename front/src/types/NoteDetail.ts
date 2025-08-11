interface Tag {
  tagId: number;
  tagName: string;
}

interface Problem {
  problemId: number;
  problemName: string;
  problemTier: number;
}

interface User {
  userId: number;
  bojId: string;
  nickname: string;
  userTier: number;
}

export interface NoteDetailResponseDTO {
  noteId: number;
  problem: Problem;
  user: User;
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
  isdeleted: boolean;
  createdAt: number;
  updatedAt: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: Tag[];
  liked: boolean;
  following: boolean;
  deleted: boolean;
}
