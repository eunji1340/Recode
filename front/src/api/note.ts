<<<<<<< HEAD
import axios from 'axios';
import type { Note } from '../types/note'

export async function fetchNotes(userId: number, page = 0, size = 20): Promise<Note[]> {
  const res = await axios.get('http://localhost:8080/notes', {
    params: { page, size },
=======
import axios from './axiosInstance';
import type { Note } from '../types/note';

interface FetchNotesParams {
  userId: number;
  page: number;
  size: number;
  search?: string;
  tags?: string[];
  sort?: string;
}

export async function fetchNotes({
  userId,
  page,
  size,
  search = '',
  tags = [],
  sort = 'latest',
}: FetchNotesParams): Promise<Note[]> {
  const params: Record<string, any> = {
    page,
    size,
    sort,
    search,
    tag: tags[0], // TODO: 백엔드 다중 태그되면 tags: []
  };

  const res = await axios.get(`/notes`, {
    params,
>>>>>>> front
    headers: {
      userId: userId.toString(),
    },
  });

<<<<<<< HEAD
  return res.data.data.details; // 백엔드 응답 구조 기준
=======
  return res.data.data.details; // 무한스크롤을 위한 배열 반환
>>>>>>> front
}
