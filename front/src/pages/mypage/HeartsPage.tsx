import React, { useMemo, useCallback } from 'react';
import FeedCard from '../../components/feed/FeedCard';
import EmptyState from '../../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../../hooks/useInfiniteFeeds';
import { fetchLikedFeeds, addFollow, removeFollow } from '../../api/feed';
import { useUserStore } from '../../stores/userStore';
import type { ExploreFeedCardData } from '../../types/feed';

export default function HeartsPage() {
  const { userId } = useUserStore();

  /** 검색·태그 제거 → 훅에 전달할 파라미터는 빈 객체 */
  const searchParams = useMemo(() => ({}), []);

  // fetchFn을 아예 useCallback으로 감싸서 참조 유지
  const fetchLikedFeedsWithUserId = useCallback(
    (params: any) => {
      if (!userId) {
        return Promise.resolve({ items: [], last: true });
      }
      return fetchLikedFeeds({ ...params, userId: Number(userId) });
    },
    [userId],
  );

  const {
    dataList: feeds,
    isLoading,
    error,
    observerRef,
    retry,
    updateFollowState,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetchLikedFeedsWithUserId,
    searchParams,
    15,
    0,
    Boolean(userId),
  );

  /** 팔로우 토글 */
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
      updateFollowState(targetUserId, newState);
    } catch (e) {
      console.error('팔로우 토글 실패:', e);
    }
  };

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
    <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
      <div className="max-w-[1200px] mx-auto">
        {isLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">좋아요한 피드를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {feeds.length === 0 ? (
              <EmptyState
                title="좋아요한 오답노트가 없습니다"
                description="마음에 드는 오답노트에 좋아요를 눌러보세요!"
                buttonText="피드 둘러보기"
                onButtonClick={() => (window.location.href = '/')}
              />
            ) : (
              <div className="flex flex-wrap justify-center gap-3">
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
            )}
          </>
        )}
        <div ref={observerRef} className="h-1" />
        {isLoading && feeds.length > 0 && (
          <div className="w-full text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8400] mx-auto"></div>
          </div>
        )}
      </div>
    </main>
  );
}
