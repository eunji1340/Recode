import React, { useState, useMemo } from 'react';
import SearchBox from '../components/search/SearchBox';
import SearchUserScopeTabs from '../components/search/SearchUserScopeTabs';
import FeedCard from '../components/feed/FeedCard';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { fetchExploreFeeds } from '../api/feed';
import type { ExploreFeedCardData, SortOption } from '../types/feed';
import { Link } from 'react-router-dom';

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [userScope, setUserScope] = useState<'all' | 'following'>('all');

  // API 요청용 파라미터
  const searchParams = useMemo(
    () => ({
      search,
      tag: tagForQuery,
      sort: sortBy,
      scope: userScope,
    }),
    [search, tagForQuery, sortBy, userScope],
  );

  // 무한스크롤 훅
  const {
    dataList: rawFeeds,
    isLoading,
    observerRef,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    fetchExploreFeeds,
    searchParams,
    15,
  );

  // 클라이언트 필터링 (following 탭일 경우만)
  const sortedFeeds = useMemo(() => {
    let feeds =
      userScope === 'following'
        ? rawFeeds.filter((feed) => feed.following)
        : [...rawFeeds];

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
  }, [rawFeeds, userScope, sortBy]);

  return (
    <main className="flex-1 bg-[#F8F9FA] py-5 px-10">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <SearchUserScopeTabs value={userScope} onChange={setUserScope} />

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

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
          {sortedFeeds.map((feed) => (
            <FeedCard key={feed.noteId} {...feed} />
          ))}

          {sortedFeeds.length === 0 && !isLoading && (
            <div className="text-center w-full py-8 text-sm text-zinc-400">
              표시할 피드가 없습니다.
            </div>
          )}
        </div>

        <div ref={observerRef} className="h-1" />

        {isLoading && (
          <div className="text-center py-6 text-sm text-zinc-500">
            피드를 불러오는 중...
          </div>
        )}
      </div>
    </main>
  );
}
