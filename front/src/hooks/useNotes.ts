// // src/hooks/useInfiniteNotes.ts

// import { useMemo } from 'react';
// import { useInfiniteFeeds } from './useInfiniteFeeds';
// import { fetchNotes } from '../api/note';
// import type { Note } from '../types/note';

// interface UseInfiniteNotesParams {
//   userId: number;
//   search?: string;
//   tags?: string[];
//   sort?: 'latest' | 'likes' | 'views' | 'comments';
// }

// /**
//  * 마이페이지 오답노트 전용 무한스크롤 훅
//  * - userId, 검색어, 태그, 정렬 조건 기반
//  * - 내부적으로 useInfiniteFeeds 사용
//  */
// export function useInfiniteNotes({
//   userId,
//   search = '',
//   tags = [],
//   sort = 'latest',
// }: UseInfiniteNotesParams) {
//   const searchParams = useMemo(
//     () => ({
//       userId,
//       search,
//       tags,
//       sort,
//     }),
//     [userId, search, tags, sort]
//   );

//   return useInfiniteFeeds<Note>(fetchNotes, searchParams, 15);
// }
