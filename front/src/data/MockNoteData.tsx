import type { NoteData } from '../types';

const mockNoteData: { data: NoteData } = {
  data: {
    noteId: 126,
    userId: 9,
    problemId: 3000,
    problemName: '최댓값 찾기',
    noteTitle: 'max 함수 사용하기',
    content: '리스트에서 최댓값을 찾는 문제였는데 반복문으로 해결하려다 실패.',
    successCode: 'print(max(arr))',
    successCodeStart: 4,
    successCodeEnd: 6,
    failCode: 'for i in arr: if i > max: max = i',
    failCodeStart: 4,
    failCodeEnd: 7,
    viewCount: 102,
    createdAt: '2025-07-28T08:00:00',
    updatedAt: '2025-07-28T08:01:30',
    isPublic: true,
    isDeleted: false,
  },
};

export default mockNoteData;
