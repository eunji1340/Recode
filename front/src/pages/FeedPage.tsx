import React, { useState, useMemo } from 'react';
import SearchBox from '../components/search/SearchBox';
import MainFeedCard from '../components/feed/MainFeed';
import EmptyFeedState from '../components/feed/EmptyFeedState'; // 추가
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchMainFeeds } from '../api/feed';
import { useNavigate } from 'react-router-dom'; // 추가

const FeedPage = () => {
  const navigate = useNavigate(); // 추가
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
              reset();
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
        {feeds.length > 0 ? (
          <>
            {feeds.map((item) => (
              <MainFeedCard
                key={`${item.noteId}-${item.user.userId}`}
                {...item}
              />
            ))}
            <div ref={observerRef} />
          </>
        ) : !isLoading ? (
          <EmptyFeedState 
            onExplore={() => navigate('/explore')}
          />
        ) : null}
      </div>

      {/* 로딩 표시 */}
      {isLoading && <p className="text-sm text-zinc-400 mt-6">불러오는 중...</p>}
    </main>
  );
};

export default FeedPage;