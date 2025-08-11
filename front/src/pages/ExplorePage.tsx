import React, { useState, useMemo, useCallback } from 'react';
import SearchBox from '../components/search/SearchBox';
import SearchUserScopeTabs from '../components/search/SearchUserScopeTabs';
import FeedCard from '../components/feed/FeedCard';
import EmptyState from '../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchExploreFeeds } from '../api/feed';
import type { ExploreFeedCardData, SortOption } from '../types/feed';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [userScope, setUserScope] = useState<'all' | 'following'>('all');

  // API 요청용 파라미터
  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
      sort: sortBy,
      scope: userScope,
    }),
    [search, tagForQuery, sortBy, userScope],
  );

  // 무한스크롤 훅
  const {
    dataList: rawFeeds,
    isLoading,
    error,
    observerRef,
    retry,
  } = useInfiniteFeeds<ExploreFeedCardData>(fetchExploreFeeds, searchParams, 15);

  // 클라이언트 정렬/필터(팔로잉 탭 전용)
  const sortedFeeds = useMemo(() => {
    let feeds =
      userScope === 'following'
        ? rawFeeds.filter((f) => f.following)
        : [...rawFeeds];

    if (sortBy === 'latest') {
      feeds.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === 'views') {
      feeds.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    } else if (sortBy === 'likes') {
      feeds.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
    } else if (sortBy === 'comments') {
      feeds.sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0));
    }
    return feeds;
  }, [rawFeeds, userScope, sortBy]);

  /** 핸들러 */
  const handleKeywordChange = useCallback((val: string) => setSearch(val), []);
  const handleAddTag = useCallback((tag: string) => {
    setTags((prev) => [...prev, tag]);
    setTagForQuery(tag);
  }, []);
  const handleRemoveTag = useCallback((tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    setTagForQuery(newTags.at(-1) ?? '');
  }, [tags]);
  const handleSortChange = useCallback((val: SortOption) => setSortBy(val), []);
  const resetFilters = useCallback(() => {
    setSearch('');
    setTags([]);
    setTagForQuery('');
    setSortBy('latest');
    setUserScope('all');
  }, []);

  /** 에러 상태 */
  if (error) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 text-4xl mb-4">!</div>
            <h2 className="text-xl font-semibold text-[#13233D] mb-4">
              피드를 불러오는데 실패했습니다
            </h2>
            <p className="text-[#13233D]/70 mb-8">잠시 후 다시 시도해주세요.</p>
            <button
              onClick={retry}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <SearchUserScopeTabs value={userScope} onChange={setUserScope} />

        <SearchBox
          selectedTags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onKeywordChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />


        {/* 초기 로딩 */}
        {isLoading && sortedFeeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">피드를 불러오는 중...</p>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto space-y-6">
            {sortedFeeds.length === 0 ? (
              <EmptyState
                title="표시할 피드가 없습니다"
                description="검색어/태그/정렬 또는 팔로잉 범위를 확인해 주세요."
                buttonText="필터 초기화"
                onButtonClick={resetFilters}
              />
            ) : (
              <>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
                  {sortedFeeds.map((feed) => (
                    <FeedCard key={feed.noteId} {...feed} />
                  ))}
                </div>

                {/* 무한 스크롤 트리거 */}
                <div ref={observerRef} className="h-1" />

                {/* 추가 로딩 */}
                {isLoading && sortedFeeds.length > 0 && (
                  <div className="w-full text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8400] mx-auto"></div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
