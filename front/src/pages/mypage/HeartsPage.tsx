import React, { useState, useMemo, useCallback } from 'react';
import SearchBox from '../../components/search/SearchBox';
import FeedCard from '../../components/feed/FeedCard';
import EmptyState from '../../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../../hooks/useInfiniteFeeds';
import { fetchLikedFeeds } from '../../api/feed';
import { useUserStore } from '../../stores/userStore';
import type { ExploreFeedCardData } from '../../types/feed';
import { addFollow, removeFollow } from '../../api/feed'; // 팔로우 API import

/**
 * 사용자가 좋아요한 피드 목록 페이지 (정렬 옵션 제거)
 * 검색, 태그 필터링만 포함
 */
export default function HeartsPage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');

  const { userId } = useUserStore();

  // API 요청 파라미터 (sort 제거)
  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
    }),
    [search, tagForQuery]
  );

  /**
   * userId를 포함한 좋아요 피드 fetch 함수
   * userId가 없으면 빈 배열을 반환하여 불필요한 API 호출 방지
   */
  const fetchLikedFeedsWithUserId = useMemo(
    () => (params: any) => {
      if (!userId) {
        return Promise.resolve({ items: [], last: true });
      }
      return fetchLikedFeeds({ ...params, userId: Number(userId) });
    },
    [userId]
  );

  const {
    dataList: feeds,
    isLoading,
    error,
    observerRef,
    retry,
    updateFollowState, // useInfiniteFeeds 훅에서 updateFollowState 함수를 받아옵니다.
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetchLikedFeedsWithUserId,
    searchParams,
    15
  );

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

  // 검색 핸들러들
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
    [tags]
  );

  // 로그인하지 않은 경우
  if (!userId) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-[#13233D] mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-[#13233D]/70 mb-8">
              좋아요한 오답노트를 보려면 로그인해주세요.
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

  // API 에러 발생시
  if (error) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 text-4xl mb-4">!</div>
            <h2 className="text-xl font-semibold text-[#13233D] mb-4">
              좋아요한 피드를 불러오는데 실패했습니다
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
        {/* 검색 및 태그 필터 (정렬 props 제거) */}
        <SearchBox
          selectedTags={tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onKeywordChange={handleKeywordChange}
        />

        {/* 초기 로딩 상태 */}
        {isLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">좋아요한 피드를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 피드가 없는 경우 */}
            {feeds.length === 0 ? (
              <EmptyState
                title="좋아요한 오답노트가 없습니다"
                description="마음에 드는 오답노트에 좋아요를 눌러보세요!"
                buttonText="피드 둘러보기"
                onButtonClick={() => (window.location.href = '/')}
              />
            ) : (
              /* 피드 목록 */
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

                {/* 무한 스크롤 트리거 */}
                <div ref={observerRef} className="h-1" />

                {/* 추가 로딩 중 표시 */}
                {isLoading && feeds.length > 0 && (
                  <div className="w-full text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8400] mx-auto"></div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}