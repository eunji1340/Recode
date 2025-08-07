import React, { useState } from 'react';
import SearchBox from '../components/search/SearchBox';
import MainFeedCard from '../components/feed/MainFeed';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchMainFeeds } from '../api/feed';
import { Link } from 'react-router-dom';

/**
 * FeedPage - 메인 피드 페이지
 * - 상단: 검색창(SearchBox)
 * - 하단: 무한스크롤 기반 피드(MainFeedCard) 목록 출력
 */
const FeedPage = () => {
  // 정렬 기준
  const [sortBy, setSortBy] = useState<
    'latest' | 'likes' | 'views' | 'comments'
  >('latest');

  // 검색 파라미터 (search + tags)
  const [searchParams, setSearchParams] = useState({
    search: '',
    tags: [] as string[],
  });

  // 무한스크롤 훅
  const {
    dataList: feeds,
    isLoading,
    observerRef,
    reset,
  } = useInfiniteFeeds(fetchMainFeeds, { sort: sortBy, ...searchParams }, 10);

  // 검색 실행 핸들러
  const handleSearch = (params: { search: string; tags: string[] }) => {
    setSearchParams(params);
    reset(); // 새 검색 조건으로 피드 리셋
  };

  return (
    <main className="flex flex-col items-center bg-[#F8F9FA] py-6">
      {/* 검색창 */}
      <div className="w-full max-w-[1100px] mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <SearchBox
            onSearch={handleSearch}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {/* 피드 목록 */}
      <div className="w-full max-w-[1100px] flex flex-col gap-6">
        {feeds.map((item) => (
          <Link to={`/note/${item.noteId}`}>
            <MainFeedCard
              key={`${item.noteId}-${item.user.userId}`}
              {...item}
            />
          </Link>
        ))}
        <div ref={observerRef} />
      </div>

      {/* 로딩 표시 */}
      {isLoading && (
        <p className="text-sm text-zinc-400 mt-6">불러오는 중...</p>
      )}
    </main>
  );
};

export default FeedPage;
