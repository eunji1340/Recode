import React, { useMemo } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useInfiniteFeeds } from '../../hooks/useInfiniteFeeds';
import { fetchUserComments } from '../../api/feed';
import type { CommentFeedCardData } from '../../types/feed';
import CommentCard from '../../components/feed/CommentFeedCard';
import EmptyState from '../../components/feed/EmptyFeedState';

/**
 * 사용자의 댓글 목록을 무한 스크롤로 표시하는 페이지
 */
export default function MyCommentsPage() {
  const { userId } = useUserStore();

  /**
   * userId를 포함한 댓글 fetch 함수
   * userId가 없으면 빈 배열을 반환하여 불필요한 API 호출 방지
   */
  const fetchCommentsWithUserId = useMemo(
    () => (params: any) => {
      if (!userId) {
        return Promise.resolve({ items: [], last: true });
      }
      return fetchUserComments({ ...params, userId: Number(userId) });
    },
    [userId],
  );

  const {
    dataList: comments,
    isLoading,
    error,
    observerRef,
    retry,
  } = useInfiniteFeeds<CommentFeedCardData>(
    fetchCommentsWithUserId,
    {},
    15,
    0,
    Boolean(userId),
  );
  
  // 로그인하지 않은 경우
  if (!userId) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-zinc-600 mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-zinc-500 mb-8">
              내 댓글을 보려면 로그인해주세요.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
            <h2 className="text-xl font-semibold text-zinc-600 mb-4">
              댓글을 불러오는데 실패했습니다
            </h2>
            <p className="text-zinc-500 mb-8">잠시 후 다시 시도해주세요.</p>
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

  // 로딩 중이고 댓글이 없는 경우 (초기 로딩)
  if (isLoading && comments.length === 0) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-zinc-500">댓글을 불러오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  // 댓글이 없는 경우
  if (!isLoading && comments.length === 0) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-3 px-10">
        <div className="max-w-[1200px] mx-auto">
          <EmptyState
            title="아직 작성한 댓글이 없습니다"
            description="다른 사용자의 글에 댓글을 남겨보세요!"
            buttonText="피드 둘러보기"
            onButtonClick={() => (window.location.href = '/')}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#F8F9FA] py-2 px-10">
      <div className="max-w-[1200px] mx-auto">
        {/* 댓글 목록 */}
        <div className="flex flex-wrap justify-center gap-4">
          {comments.map((comment) => (
            <CommentCard
              key={`${comment.noteId}-${comment.createdAt}`}
              {...comment}
            />
          ))}
        </div>

        {/* 무한 스크롤 트리거 */}
        <div ref={observerRef} className="h-1" />

        {/* 추가 로딩 중 표시 */}
        {isLoading && comments.length > 0 && (
          <div className="w-full text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
      </div>
    </main>
  );
}
