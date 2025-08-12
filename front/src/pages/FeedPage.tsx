import React, { useState, useMemo, useCallback } from 'react';
import SearchBox from '../components/search/SearchBox';
import MainFeedCard from '../components/feed/MainFeed';
import EmptyState from '../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchMainFeeds } from '../api/feed';
import { useNavigate } from 'react-router-dom';

export default function FeedPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');

  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
    }),
    [search, tagForQuery]
  );

  const {
    dataList: feeds,
    isLoading,
    error,
    observerRef,
    retry,
  } = useInfiniteFeeds(fetchMainFeeds, searchParams, 10);

  const handleKeywordChange = useCallback((val: string) => setSearch(val), []);
  const handleAddTag = useCallback((tag: string) => {
    setTags(prev => [...prev, tag]);
    setTagForQuery(tag);
  }, []);
  const handleRemoveTag = useCallback((tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    setTagForQuery(newTags.at(-1) ?? '');
  }, [tags]);

  // 에러 상태
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
      {/* 검색창 */}
      <div className="w-full max-w-[1100px] mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <SearchBox
            selectedTags={tags}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onKeywordChange={handleKeywordChange}
          />
        </div>
      </div>

      {/* 초기 로딩 */}
      {isLoading && feeds.length === 0 ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
          <p className="text-[#13233D]/70">피드를 불러오는 중...</p>
        </div>
      ) : (
        <div className="w-full max-w-[1100px] flex flex-col gap-6">
          {feeds.length === 0 ? (
            <EmptyState
              title="등록된 피드가 없습니다"
              description="다른 사용자들을 팔로잉하고 피드를 구경해보세요!"
              buttonText="둘러보기"
              onButtonClick={() => navigate('/explore')}
            />
          ) : (
            <>
              {feeds.map(item => (
                <MainFeedCard
                  key={`${item.noteId}-${item.user.userId}`}
                  {...item}
                />
              ))}
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
    </main>
  );
}
