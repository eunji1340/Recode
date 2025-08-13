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
  userId?: number;
  nickname?: string;
  noteId: number;
  content: string;
  createdAt: string;
  profilePic?: string; // 추후 확인
  onCommentDeleted?: () => void;
}

// 제출 내역 결과 리스트의 인터페이스
export interface SubmissionItem {
  submissionId: number;
  language: string;
  codeLength: string | null;
  submittedAt: string;
  runtime: number | null;
  memory: number | null;
  code: string;
  resultText: string;
}

// submissionData 추가
export interface SubmissionData {
  count: number;
  detail: SubmissionItem[];
}

export interface SubmissionApiResponse {
  data: {
    pass: SubmissionData;
    fail: SubmissionData;
  };
}
