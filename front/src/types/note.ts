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
