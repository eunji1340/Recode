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
    headers: {
      userId: userId.toString(),
    },
  });

  return res.data.data.details; // 무한스크롤을 위한 배열 반환
}
