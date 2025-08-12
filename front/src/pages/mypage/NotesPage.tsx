import React, { useState, useMemo, useCallback } from 'react';
import SearchBox from '../../components/search/SearchBox';
import FeedCard from '../../components/feed/FeedCard';
import EmptyState from '../../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../../hooks/useInfiniteFeeds';
import { fetchUserFeeds } from '../../api/feed';
import type { ExploreFeedCardData } from '../../types/feed';
import { useUserStore } from '../../stores/userStore';

/**
 * 내 오답노트 목록 페이지
 * - 검색/태그 + 무한스크롤
 * - HeartsPage와 동일한 UX 패턴(에러/빈상태/로딩)
 */
export default function MyNotesPage() {
  // 입력 상태 (SearchBox에서 관리)
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');
  
  // 실제 검색 파라미터 (검색 실행 시에만 업데이트)
  const [searchQuery, setSearchQuery] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  
  const [resetKey, setResetKey] = useState(0);

  const { userId } = useUserStore();

  // API 요청 파라미터
  const searchParams = useMemo(
    () => ({
      search: searchQuery,
      tag: tagQuery,
    }),
    [searchQuery, tagQuery],
  );

  /**
   * userId가 없으면 호출을 막고 빈 결과 반환
   */
  const fetchUserFeedsWithUserId = useMemo(
    () => (params: any) => {
      if (!userId) {
        return Promise.resolve({ items: [], last: true });
      }
      return fetchUserFeeds({ ...params, userId: Number(userId) });
    },
    [userId],
  );

  // 무한스크롤 훅
  const {
    dataList: feeds,
    isLoading,
    error,
    observerRef,
    retry,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetchUserFeedsWithUserId,
    searchParams,
    15,
    resetKey,
  );

  /** 검색 실행 - SearchBox의 onSearch 콜백 */
  const handleSearch = useCallback((nextKeyword: string, nextTag: string) => {
    setSearchQuery(nextKeyword);
    setTagQuery(nextTag);
    setResetKey((v) => v + 1); // 첫 페이지부터 다시 로드
  }, []);

  /** 초기화 */
  const handleResetFilters = useCallback(() => {
    setKeyword('');
    setTag('');
    setSearchQuery('');
    setTagQuery('');
    setResetKey((v) => v + 1);
  }, []);

  // 비로그인
  if (!userId) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-[#13233D] mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-[#13233D]/70 mb-8">
              내 오답노트를 보려면 로그인해주세요.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="px-6 py-2 bg-[#FF8400] text-white rounded-lg hover:bg-[#FF8400]/90 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  // API 에러
  if (error) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 text-4xl mb-4">!</div>
            <h2 className="text-xl font-semibold text-[#13233D] mb-4">
              내 오답노트를 불러오는데 실패했습니다
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
    <main className="flex-1 bg-[#F8F9FA]">
      <div className="mx-auto space-y-3">
        {/* 검색/필터 */}
        <SearchBox
          keyword={keyword}
          onKeywordChange={setKeyword}
          tag={tag}
          onTagChange={setTag}
          onSearch={handleSearch}
          onClearAll={handleResetFilters}
        />

        {/* 피드 컨텐츠 */}
        {isLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">오답노트를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 빈 상태 */}
            {feeds.length === 0 ? (
              <EmptyState
                title={
                  searchQuery || tagQuery
                    ? "검색 조건에 맞는 오답노트가 없어요"
                    : "아직 작성한 오답노트가 없어요"
                }
                description={
                  searchQuery || tagQuery
                    ? "다른 키워드로 검색해보세요."
                    : "문제를 풀고 첫 번째 오답노트를 작성해보세요!"
                }
                buttonText={
                  searchQuery || tagQuery
                    ? "검색 초기화"
                    : "첫 오답노트 작성하기"
                }
                onButtonClick={
                  searchQuery || tagQuery
                    ? handleResetFilters
                    : () => (window.location.href = '/note/generate')
                }
              />
            ) : (
              <>
                {/* 피드 카드 그리드 - 고정 크기, 간격 조절 */}
                <div className="flex flex-wrap justify-center gap-4">
                  {feeds.map((feed) => (
                    <FeedCard key={feed.noteId} {...feed} />
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