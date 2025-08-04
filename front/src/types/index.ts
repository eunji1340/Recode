// note 형식
export interface NoteData {
  noteId: number;
  userId: number;
  problemId: number;
  problemName: string;
  noteTitle: string;
  content: string;
  successCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  failCode: string;
  failCodeStart: number;
  failCodeEnd: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isDeleted: boolean;
}

//  comment 형식
export interface CommentData {
  commentId?: number;
  userId: number;
  noteId: number;
  content: string;
  createdAt: string;
  profilePic?: string; // 추후 확인
}
