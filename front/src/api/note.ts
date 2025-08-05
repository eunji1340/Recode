import axios from 'axios';
import type { Note } from '../types/note'

export async function fetchNotes(userId: number, page = 0, size = 20): Promise<Note[]> {
  const res = await axios.get('http://localhost:8080/notes', {
    params: { page, size },
    headers: {
      userId: userId.toString(),
    },
  });

  return res.data.data.details; // 백엔드 응답 구조 기준
}
