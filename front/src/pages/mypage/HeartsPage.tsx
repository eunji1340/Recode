import React, { useState, useMemo, useCallback } from 'react';
import SearchBox from '../../components/search/SearchBox';
import FeedCard from '../../components/feed/FeedCard';
import { useInfiniteFeeds } from '../../hooks/useInfiniteFeeds';
import { fetchLikedFeeds } from '../../api/feed'; // 새로운 API 함수를 임포트
import type { ExploreFeedCardData, SortOption } from '../../types/feed';
import { useUserStore } from '../../stores/userStore';
import EmptyFeedState from '../../components/feed/EmptyFeedState'; // 빈 상태 컴포넌트 추가
import { useNavigate } from 'react-router-dom';

export default function HeartsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  // 현재 로그인한 사용자 정보 가져오기
  const { userId } = useUserStore();

  // API 요청용 정렬 타입 매핑
  const sortTypeMap = {
    latest: 0,
    views: 1,
    likes: 2,
    comments: 3,
  };

  // API 요청용 파라미터
  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
      sortType: sortTypeMap[sortBy], // API 명세에 맞게 sortType으로 변경
    }),
    [search, tagForQuery, sortBy],
  );

  // userId가 변경될 때마다 fetch 함수를 재정의
  const fetchLikedFeedsWithUserId = useMemo(
    () => (params: any) => {
      if (!userId) {
        return Promise.resolve({ items: [], last: true });
      }
      return fetchLikedFeeds({ ...params, userId: Number(userId) });
    },
    [userId],
  );

  // 무한스크롤 훅
  const {
    dataList: feeds,
    isLoading,
    observerRef,
    reset,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetchLikedFeedsWithUserId,
    searchParams,
    15,
  );

  // SearchBox 핸들러
  const handleKeywordChange = useCallback(
    (val: string) => {
      setSearch(val);
      reset();
    },
    [reset],
  );

  const handleAddTag = useCallback(
    (tag: string) => {
      setTags((prev) => [...prev, tag]);
      setTagForQuery(tag);
      reset();
    },
    [reset],
  );

  const handleRemoveTag = useCallback(
    (tag: string) => {
      const newTags = tags.filter((t) => t !== tag);
      setTags(newTags);
      setTagForQuery(newTags.at(-1) ?? '');
      reset();
    },
    [tags, reset],
  );

  const handleSortChange = useCallback(
    (val: SortOption) => {
      setSortBy(val);
      reset();
    },
    [reset],
  );

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
              좋아요한 오답노트를 보려면 로그인해주세요.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="flex-1 bg-[#F8F9FA] max-w-[1200px] mx-auto space-y-6">
      <SearchBox
        selectedTags={tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onKeywordChange={handleKeywordChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-8">
        {feeds.map((feed) => (
          <FeedCard key={feed.noteId} {...feed} />
        ))}
        <div ref={observerRef} className="h-1" />
      </div>
    </div>
  );
}
