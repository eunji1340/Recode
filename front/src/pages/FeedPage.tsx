import React, { useState, useMemo } from 'react';
import SearchBox from '../components/search/SearchBox';
import MainFeedCard from '../components/feed/MainFeed';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchMainFeeds } from '../api/feed';
import { Link } from 'react-router-dom';

/**
 * FeedPage - 메인 피드 페이지
 * - 상단: 검색창(SearchBox)
 * - 하단: 무한스크롤 기반 피드(MainFeedCard) 목록 출력
 */
const FeedPage = () => {
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'views' | 'comments'>('latest');
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');

  // 검색 파라미터 메모이제이션
  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
      sort: sortBy,
    }),
    [search, tagForQuery, sortBy]
  );

  const {
    dataList: feeds,
    isLoading,
    observerRef,
    reset,
  } = useInfiniteFeeds(fetchMainFeeds, searchParams, 10);

  return (
    <main className="flex flex-col items-center bg-[#F8F9FA] py-6">
      {/* 검색창 */}
      <div className="w-full max-w-[1100px] mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <SearchBox
            selectedTags={tags}
            onAddTag={(tag) => {
              setTags((prev) => [...prev, tag]);
              setTagForQuery(tag);
              reset(); // 검색 리셋
            }}
            onRemoveTag={(tag) => {
              const newTags = tags.filter((t) => t !== tag);
              setTags(newTags);
              setTagForQuery(newTags.at(-1) ?? '');
              reset();
            }}
            onKeywordChange={(val) => {
              setSearch(val);
              reset();
            }}
            sortBy={sortBy}
            onSortChange={(val) => {
              setSortBy(val);
              reset();
            }}
          />
        </div>
      </div>

      {/* 피드 목록 */}
      <div className="w-full max-w-[1100px] flex flex-col gap-6">
        {feeds.map((item) => (
          <Link key={item.noteId} to={`/note/${item.noteId}`}>
            <MainFeedCard key={`${item.noteId}-${item.user.userId}`} {...item} />
          </Link>
        ))}
        <div ref={observerRef} />
      </div>

      {/* 로딩 표시 */}
      {isLoading && <p className="text-sm text-zinc-400 mt-6">불러오는 중...</p>}
    </main>
  );
};

export default FeedPage;
