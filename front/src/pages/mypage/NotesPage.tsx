import React, { useState, useMemo } from 'react';
import SearchBox from '../../components/search/SearchBox';
import FeedCard from '../../components/feed/FeedCard';
import mockNoteData from '../../data/MockNoteData';
import type { SortOption } from '../../types/feed';

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  const filteredNotes = useMemo(() => {
    let notes = mockNoteData.map((item) => item.data);

    if (search) {
      notes = notes.filter(
        (n) =>
          n.noteTitle.includes(search) ||
          n.problemName.includes(search) ||
          n.content.includes(search)
      );
    }

    if (tagForQuery) {
      notes = notes.filter((n) => n.content.includes(tagForQuery));
    }

    if (sortBy === 'latest') {
      notes.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === 'views') {
      notes.sort((a, b) => b.viewCount - a.viewCount);
    } else if (sortBy === 'likes') {
      notes.sort((a, b) => b.viewCount - a.viewCount); // likes 없음 → view 대체
    }

    return notes;
  }, [search, tagForQuery, sortBy]);

  return (
    <main className="flex-1 bg-[#F8F9FA]">
      <div className="max-w-[1200px] mx-auto space-y-3">
        {/* 검색창 */}
        <SearchBox
          selectedTags={tags}
          onAddTag={(tag) => {
            setTags((prev) => [...prev, tag]);
            setTagForQuery(tag);
          }}
          onRemoveTag={(tag) => {
            const newTags = tags.filter((t) => t !== tag);
            setTags(newTags);
            setTagForQuery(newTags.at(-1) ?? '');
          }}
          onKeywordChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 오답노트 카드 목록 */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          {filteredNotes.map((note) => (
            <FeedCard
              key={note.noteId}
              noteId={note.noteId}
              viewcount={note.viewCount}
              isLiked={false}
              likeCount={note.viewCount}
              isFollowing={note.userId === 7} // 예시
              commentCount={0}
              noteTitle={note.noteTitle}
              createdAt={note.createdAt}
              user={{
                userId: note.userId,
                nickname: '닉네임',
                image: '/images/profile1.png',
              }}
              successLanguage="python"
              problem={{
                problemId: note.problemId,
                problemName: note.problemName,
                problemTier: 5,
              }}
              tags={['예시', '태그']}
            />
          ))}

          {/* 결과 없음 */}
          {filteredNotes.length === 0 && (
            <div className="text-center col-span-full py-8 text-sm text-zinc-400">
              표시할 오답노트가 없습니다.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
