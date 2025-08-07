import React, { useState, useMemo } from 'react';
import SearchBox from '../components/search/SearchBox';
import SearchUserScopeTabs from '../components/search/SearchUserScopeTabs';
import FeedCard from '../components/feed/FeedCard';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchExploreFeeds } from '../api/feed';
import type { ExploreFeedCardData, SortOption } from '../types/feed';
import { Link } from 'react-router-dom';

/**
 * ExplorePage - 전체 피드 탐색 페이지
 * - 무한스크롤 기반 탐색
 * - 검색어, 태그, 정렬, 유저 범위 조건 포함
 */
export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [userScope, setUserScope] = useState<'all' | 'following'>('all');

  // 무한스크롤 훅 사용
  const searchParams = useMemo(
    () => ({
      search,
      tags,
      sort: sortBy,
      scope: userScope,
    }),
    [search, tags, sortBy, userScope],
  );

  const {
    dataList: feeds,
    isLoading,
    observerRef,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetchExploreFeeds,
    searchParams,
    15,
  );

  return (
    <main className="flex-1 px-18 py-5 bg-[#F8F9FA]">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <SearchUserScopeTabs value={userScope} onChange={setUserScope} />
        <SearchBox
          onSearch={({ search, tags }) => {
            setSearch(search);
            setTags(tags);
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-y-6">
          {feeds.map((feed) => (
            <Link key={feed.noteId} to={`/note/${feed.noteId}`}>
              <FeedCard key={feed.noteId} {...feed} />
            </Link>
          ))}

          {/* 피드가 없을 때 */}
          {feeds.length === 0 && !isLoading && (
            <div className="text-center col-span-full py-8 text-sm text-zinc-400">
              표시할 피드가 없습니다.
            </div>
          )}
        </div>
        {/* 마지막 요소 감지용 */}
        <div ref={observerRef} className="h-1" />
        {/* 로딩 중일 때 표시 */}
        {isLoading && (
          <div className="text-center py-6 text-sm text-zinc-500">
            피드를 불러오는 중...
          </div>
        )}
      </div>
    </main>
  );
}
