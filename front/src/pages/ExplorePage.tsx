import React, { useEffect, useState } from 'react';
import SearchBox from '../components/search/SearchBox';
import SearchUserScopeTabs from '../components/search/SearchUserScopeTabs';
import type { SortOption } from '@/types/feed';
import FeedCard from '../components/feed/FeedCard';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';

interface ApiFeed {
  noteId: number;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  following: boolean;
  user: {
    userId: number;
    nickname: string;
    bojId: string;
    userTier: number;
  };
  problem: {
    problemId: number;
    problemName: string;
    problemTier: number;
  };
  tags: string[];
}

interface FeedCardData {
  noteId: number;
  noteTitle: string;
  content: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isFollowing: boolean;
  user: {
    userId: number;
    nickname: string;
    image?: string;
  };
  problem: {
    problemId: number;
    problemName: string;
    tier: number;
    language?: string;
  };
  tags: string[];
}

function mapApiFeedToFeedCardData(apiFeed: ApiFeed): FeedCardData {
  return {
    noteId: apiFeed.noteId,
    noteTitle: apiFeed.problem.problemName ?? '문제 이름 없음',
    content: apiFeed.content,
    createdAt: apiFeed.createdAt,
    likeCount: apiFeed.likeCount,
    commentCount: apiFeed.commentCount,
    isLiked: apiFeed.liked,
    isFollowing: apiFeed.following,
    user: {
      userId: apiFeed.user.userId,
      nickname: apiFeed.user.nickname,
      image: '',
    },
    problem: {
      problemId: apiFeed.problem.problemId,
      problemName: apiFeed.problem.problemName,
      tier: apiFeed.problem.problemTier,
    },
    tags: apiFeed.tags ?? [],
  };
}

export default function ExplorePage() {
  const [feeds, setFeeds] = useState<FeedCardData[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [userScope, setUserScope] = useState<'all' | 'following'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);

  useEffect(() => {
    // token 포함된 api로 대체
    // fetch('http://localhost:8080/feeds?userId=1')
    //   .then((res) => res.json())
    api
      .get(`/feeds`)
      .then((response) => {
        const apiFeeds: ApiFeed[] = response.data;
        console.log(apiFeeds);
        const mappedFeeds = apiFeeds.map(mapApiFeedToFeedCardData);
        setFeeds(mappedFeeds);
      })
      .catch((err) => {
        console.error('🚨 피드 로딩 실패:', err);
      });
  }, []);

  const handleSearch = (params: { keyword: string; tags: string[] }) => {
    setSearchKeyword(params.keyword);
    setSearchTags(params.tags);
  };

  const sortedFeeds = [...feeds].sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return b.likeCount - a.likeCount;
      case 'comments':
        return b.commentCount - a.commentCount;
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  const visibleFeeds = sortedFeeds.filter((feed) => {
    const inScope = userScope === 'all' || feed.isFollowing;
    const matchesKeyword =
      searchKeyword === '' ||
      feed.noteTitle.includes(searchKeyword) ||
      feed.content.includes(searchKeyword);
    const matchesTags =
      searchTags.length === 0 ||
      searchTags.every((tag) => feed.tags.includes(tag));
    return inScope && matchesKeyword && matchesTags;
  });

  return (
    <main className="flex-1 px-18 py-5 bg-[#F8F9FA]">
      <div className="max-w-[1100px] mx-auto space-y-6">
        <SearchUserScopeTabs
          value={userScope}
          onChange={(val) => setUserScope(val)}
        />
        <SearchBox
          onSearch={handleSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-y-6">
          {visibleFeeds.map((feed) => (
            // 클릭 시 상세 페이지로 라우팅 추가
            <Link
              key={feed.noteId + feed.createdAt}
              to={`/note/${feed.noteId}`}
            >
              <FeedCard {...feed} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
