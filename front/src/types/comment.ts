// 댓글 user interface
interface User {
  userId: number;
  bojId: string;
  nickname: string;
  userTier: number;
}

// 댓글 type
interface Comment {
  commentId: number;
  user: User;
  noteId: number;
  content: string;
  createdAt: number;
  updatedAt: number | null;
}

// api 내 comment 전체 목록
export interface CommentResponse {
  details: Comment[];
}
