// 댓글 user interface
export interface User {
  userId: number;
  bojId: string;
  nickname: string;
  userTier: number;
}

// 댓글 type
export interface CommentResponseDTO {
  commentId: number;
  user: User;
  noteId: number;
  content: string;
  createdAt: number;
  updatedAt?: number | null;
}

export interface CommentApiResponse {
  details: CommentResponseDTO[];
}
