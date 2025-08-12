// src/pages/ExplorePage.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import SearchBox from '../components/search/SearchBox';
import SearchUserScopeTabs from '../components/search/SearchUserScopeTabs';
import FeedCard from '../components/feed/FeedCard';
import EmptyState from '../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchExploreFeeds, fetchMainFeeds, addFollow, removeFollow } from '../api/feed';
import type { ExploreFeedCardData } from '../types/feed';

export default function ExplorePage() {
  // 입력 상태 (SearchBox에서 관리)
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');

  // 실제 검색 파라미터 (검색 실행 시에만 업데이트)
  const [searchQuery, setSearchQuery] = useState('');
  const [tagQuery, setTagQuery] = useState('');

  // 사용자 범위 및 기타 상태
  const [userScope, setUserScope] = useState<'all' | 'following'>('all');
  const [resetKey, setResetKey] = useState(0);

  // API 요청에 사용할 파라미터
  const searchParams = useMemo(
    () => ({
      search: searchQuery,
      tag: tagQuery,
      scope: userScope,
    }),
    [searchQuery, tagQuery, userScope]
  );

  // 사용자 범위에 따른 API 함수 선택
  const fetcher = useMemo(
    () => (userScope === 'following' ? fetchMainFeeds : fetchExploreFeeds),
    [userScope]
  );

  const { dataList: feeds, isLoading, error, observerRef, retry, updateFollowState } =
    useInfiniteFeeds<ExploreFeedCardData>(fetcher, searchParams, 15, resetKey);

  /** 검색 실행 - SearchBox의 onSearch 콜백 */
  const handleSearch = useCallback((nextKeyword: string, nextTag: string) => {
    setSearchQuery(nextKeyword);
    setTagQuery(nextTag);
    setResetKey((v) => v + 1); // 첫 페이지부터 다시 로드
  }, []);

  /** 사용자 범위 변경 */
  const handleUserScopeChange = useCallback((newScope: 'all' | 'following') => {
    setUserScope(newScope);
    setResetKey((v) => v + 1); // 첫 페이지부터 다시 로드
  }, []);

  /** 팔로우 토글 */
  const handleToggleFollow = useCallback(async (targetUserId: number, newState: boolean) => {
    try {
      if (newState) {
        await addFollow(targetUserId);
      } else {
        await removeFollow(targetUserId);
      }
      updateFollowState(targetUserId, newState);
    } catch (e) {
      console.error('팔로우 토글 실패:', e);
    }
  }, [updateFollowState]);

  /** 초기화 */
  const resetFilters = useCallback(() => {
    setKeyword('');
    setTag('');
    setSearchQuery('');
    setTagQuery('');
    setUserScope('all');
    setResetKey((v) => v + 1);
  }, []);

  // 에러 상태 렌더링
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
        {/* 사용자 범위 탭 */}
        <SearchUserScopeTabs
          value={userScope}
          onChange={handleUserScopeChange}
        />

        {/* 검색 박스 */}
        <SearchBox
          keyword={keyword}
          onKeywordChange={setKeyword}
          tag={tag}
          onTagChange={setTag}
          onSearch={handleSearch}
          onClearAll={resetFilters}
        />

        {/* 피드 컨텐츠 */}
        {isLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">피드를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {feeds.length === 0 ? (
              <EmptyState
                title="표시할 피드가 없습니다"
                description={
                  searchQuery || tagQuery || userScope === 'following'
                    ? "검색 조건이나 팔로잉 범위에 맞는 피드가 없습니다."
                    : "아직 등록된 피드가 없습니다."
                }
                buttonText="필터 초기화"
                onButtonClick={resetFilters}
              />
            ) : (
              <>
                {/* 피드 카드 그리드 */}
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
          </>
        )}
      </div>
    </main>
  );
}