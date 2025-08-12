// src/pages/FeedPage.tsx
import React, { useState, useMemo, useCallback } from 'react';
import SearchBox from '../components/search/SearchBox';
import MainFeedCard from '../components/feed/MainFeed';
import EmptyState from '../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchMainFeeds } from '../api/feed';
import { useNavigate } from 'react-router-dom';

export default function FeedPage() {
  const navigate = useNavigate();
  
  // 입력 상태 (SearchBox에서 관리)
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');
  
  // 실제 검색 파라미터 (검색 실행 시에만 업데이트)
  const [searchQuery, setSearchQuery] = useState('');
  const [tagQuery, setTagQuery] = useState('');
  
  const [resetKey, setResetKey] = useState(0);

  // API 요청에 사용할 파라미터
  const searchParams = useMemo(
    () => ({
      search: searchQuery,
      tag: tagQuery,
    }),
    [searchQuery, tagQuery]
  );

  const { dataList: feeds, isLoading, error, observerRef, retry } =
    useInfiniteFeeds(fetchMainFeeds, searchParams, 10, resetKey);

  /** 검색 실행 - SearchBox의 onSearch 콜백 */
  const handleSearch = useCallback((nextKeyword: string, nextTag: string) => {
    setSearchQuery(nextKeyword);
    setTagQuery(nextTag);
    setResetKey((v) => v + 1); // 첫 페이지부터 다시 로드
  }, []);

  /** 초기화 */
  const resetFilters = useCallback(() => {
    setKeyword('');
    setTag('');
    setSearchQuery('');
    setTagQuery('');
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
    <main className="flex flex-col items-center bg-[#F8F9FA] py-6">
      {/* 검색 박스 */}
      <div className="w-full max-w-[1100px] mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <SearchBox
            keyword={keyword}
            onKeywordChange={setKeyword}
            tag={tag}
            onTagChange={setTag}
            onSearch={handleSearch}
            onClearAll={resetFilters}
          />
        </div>
      </div>

      {/* 피드 컨텐츠 */}
      <div className="w-full max-w-[1100px]">
        {/* 초기 로딩 상태 */}
        {isLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">피드를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 피드가 없는 경우 */}
            {feeds.length === 0 ? (
              <EmptyState
                title="등록된 피드가 없습니다"
                description={
                  searchQuery || tagQuery
                    ? "검색 조건에 맞는 피드가 없습니다. 다른 키워드로 검색해보세요."
                    : "다른 사용자들을 팔로잉하고 피드를 구경해보세요!"
                }
                buttonText={searchQuery || tagQuery ? "검색 초기화" : "둘러보기"}
                onButtonClick={
                  searchQuery || tagQuery ? resetFilters : () => navigate('/explore')
                }
              />
            ) : (
              /* 피드 목록 */
              <div className="flex flex-col gap-6">
                {feeds.map((item) => (
                  <MainFeedCard key={`${item.noteId}-${item.user.userId}`} {...item} />
                ))}
                
                {/* 무한 스크롤 트리거 */}
                <div ref={observerRef} className="h-1" />
                
                {/* 추가 로딩 */}
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