import type { CommentData } from '../types';

const MockCommentData: CommentData[] = [
  {
    commentId: 1,
    userId: 3,
    noteId: 3,
    content: '수정수정수정',
    createdAt: '2025-07-31T16:27:47.979946',
  },
  {
    commentId: 2,
    userId: 1,
    noteId: 3,
    content: '이 문제 정말 어려웠는데 덕분에 이해했어요!',
    createdAt: '2025-08-01T09:15:23.123456',
  },
  {
    commentId: 3,
    userId: 5,
    noteId: 3,
    content: 'BFS 접근법이 더 효율적일 것 같은데 어떻게 생각하세요?',
    createdAt: '2025-08-01T14:32:11.987654',
  },
];

export default MockCommentData;
