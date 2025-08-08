import React, { useState, useMemo } from 'react';
import SearchBox from '../../components/search/SearchBox';
import FeedCard from '../../components/feed/FeedCard';
import { useInfiniteFeeds } from '../../hooks/useInfiniteFeeds';
import { fetchUserFeeds } from '../../api/feed';
import type { ExploreFeedCardData, SortOption } from '../../types/feed';
import { useUserStore } from '../../stores/userStore';

export default function MyNotesPage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // 현재 로그인한 사용자 정보 가져오기
  const { userId } = useUserStore();

  // API 요청용 파라미터
  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
      sort: sortBy,
    }),
    [search, tagForQuery, sortBy],
  );

  const fetchUserFeedsWithUserId = useMemo(
    () => (params: any) => fetchUserFeeds({ ...params, userId: userId || 0 }),
    [userId],
  );

  // 무한스크롤 훅
  const {
    dataList: rawFeeds,
    isLoading,
    observerRef,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetchUserFeedsWithUserId, // 커링된 함수 사용
    searchParams,
    15,
  );

  // 클라이언트 정렬
  const sortedFeeds = useMemo(() => {
    const feeds = [...rawFeeds];

    if (sortBy === 'latest') {
      feeds.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === 'views') {
      feeds.sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0));
    } else if (sortBy === 'likes') {
      feeds.sort((a, b) => (b.likeCount ?? 0) - (a.likeCount ?? 0));
    } else if (sortBy === 'comments') {
      feeds.sort((a, b) => (b.commentCount ?? 0) - (a.commentCount ?? 0));
    }

    return feeds;
  }, [rawFeeds, sortBy]);

  // 로그인하지 않은 경우 처리
  if (!userId) {
    return (
      <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-zinc-600 mb-4">
              로그인이 필요합니다
            </h2>
            <p className="text-zinc-500 mb-8">
              내 오답노트를 보려면 로그인해주세요.
            </p>
            {/* 로그인 버튼이나 링크 추가 */}
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 bg-[#F8F9FA] max-w-[1200px] mx-auto space-y-6">
      {/* 검색 및 필터 */}
      <SearchBox
        selectedTags={tags}
        onAddTag={(tag) => {
          setTags((prev) => [...prev, tag]);
          setTagForQuery(tag);
        }}
        onRemoveTag={(tag) => {
          const newTags = tags.filter((t) => t !== tag);
          setTags(newTags);
          setTagForQuery(newTags.at(-1) ?? '');
        }}
        onKeywordChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* 피드 카드 목록 */}
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-8">
        {sortedFeeds.map((feed) => (
          <FeedCard key={feed.noteId} {...feed} />
        ))}

        {/* 빈 상태 처리 */}
        {sortedFeeds.length === 0 && !isLoading && (
          <div className="text-center w-full py-12">
            <div className="text-zinc-400 mb-4">
              <svg
                className="mx-auto w-16 h-16 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-zinc-600 mb-2">
              아직 작성한 오답노트가 없어요
            </h3>
            <p className="text-sm text-zinc-400 mb-6">
              문제를 풀고 첫 번째 오답노트를 작성해보세요!
            </p>
            {/* 새 노트 작성 버튼 */}
            <button
              className="bg-[#FF8400] hover:bg-[#e57600] text-white px-6 py-2 rounded-lg font-medium transition-colors"
              onClick={() => {
                // 새 노트 작성 페이지로 이동하는 로직
                window.location.href = '/note/generate';
              }}
            >
              첫 오답노트 작성하기
            </button>
          </div>
        )}
      </div>

      {/* 무한스크롤 옵저버 */}
      <div ref={observerRef} className="h-1" />

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-6 text-sm text-zinc-500">
          오답노트를 불러오는 중...
        </div>
      )}

      {/* 통계 정보 (선택사항) */}
      {sortedFeeds.length > 0 && (
        <div className="text-center py-4 text-sm text-zinc-500">
          총 {sortedFeeds.length}개의 오답노트
        </div>
      )}
    </div>
  );
}
