import React, { useState, useMemo, useCallback, useEffect } from 'react';
import SearchBox from '../components/search/SearchBox';
import SearchUserScopeTabs from '../components/search/SearchUserScopeTabs';
import FeedCard from '../components/feed/FeedCard';
import EmptyState from '../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchExploreFeeds, fetchMainFeeds } from '../api/feed'; // fetchMainFeeds 추가
import type { ExploreFeedCardData } from '../types/feed';
import { addFollow, removeFollow } from '../api/feed';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');
  const [userScope, setUserScope] = useState<'all' | 'following'>('all');
  const [feeds, setFeeds] = useState<ExploreFeedCardData[]>([]);

  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
      scope: userScope,
    }),
    [search, tagForQuery, userScope],
  );

  // userScope에 따라 다른 API 함수를 선택
  const fetcher = useMemo(() => {
    if (userScope === 'following') {
      return fetchMainFeeds;
    }
    return fetchExploreFeeds;
  }, [userScope]);

  // 무한스크롤 훅
  const {
    dataList: rawFeeds,
    isLoading,
    error,
    observerRef,
    retry,
    updateFollowState,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetcher, // 조건에 따라 선택된 fetcher 함수 전달
    searchParams,
    15,
  );

  // rawFeeds 변경 시 feeds state 업데이트
  useEffect(() => {
    setFeeds(rawFeeds);
  }, [rawFeeds]);

  /** 팔로우 토글 핸들러 - 동일 유저의 모든 카드 업데이트 */
  const handleToggleFollow = async (
    targetUserId: number,
    newState: boolean,
  ) => {
    try {
      if (newState) {
        await addFollow(targetUserId);
      } else {
        await removeFollow(targetUserId);
      }
      updateFollowState(targetUserId, newState); // UI 즉시 반영
    } catch (e) {
      console.error('팔로우 토글 실패:', e);
    }
  };

  /** 검색/태그 핸들러 */
  const handleKeywordChange = useCallback((val: string) => setSearch(val), []);
  const handleAddTag = useCallback((tag: string) => {
    setTags((prev) => [...prev, tag]);
    setTagForQuery(tag);
  }, []);
  const handleRemoveTag = useCallback(
    (tag: string) => {
      const newTags = tags.filter((t) => t !== tag);
      setTags(newTags);
      setTagForQuery(newTags.at(-1) ?? '');
    },
    [tags],
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setTags([]);
    setTagForQuery('');
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
          onKeywordChange={handleKeywordChange}
        />

        {/* 초기 로딩 */}
        {isLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">피드를 불러오는 중...</p>
          </div>
        ) : (
          <div className="max-w-[1200px] mx-auto space-y-6">
            {feeds.length === 0 ? (
              <EmptyState
                title="표시할 피드가 없습니다"
                description="검색어/태그 또는 팔로잉 범위를 확인해 주세요."
                buttonText="필터 초기화"
                onButtonClick={resetFilters}
              />
            ) : (
              <>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
                  {feeds.map((feed) => (
                    <FeedCard
                      key={feed.noteId}
                      {...feed}
                      onToggleFollow={() =>
                        handleToggleFollow(feed.user.userId, !feed.following)
                      }
                    />
                  ))}
                </div>

                {/* 무한 스크롤 트리거 */}
                <div ref={observerRef} className="h-1" />

                {/* 추가 로딩 */}
                {isLoading && feeds.length > 0 && (
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