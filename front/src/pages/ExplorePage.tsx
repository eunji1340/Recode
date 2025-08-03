<<<<<<< HEAD
import React, { useState } from 'react'
import FeedCard from '../components/feed/FeedCard';
import SearchBox from '../components/search/SearchBox';
import SearchUserScopeTabs from '../components/search/SearchUserScopeTabs';

const dummyFeeds = [
  {
    noteId: 201,
    noteTitle: '9663 N-Queen은 백트래킹의 꽃이다',
    content: 'DFS + 백트래킹의 정석 같은 문제입니다.',
    createdAt: '2025-08-03T22:00:00Z',
    likeCount: 32,
    commentCount: 14,
=======
import { useState } from 'react';
import FeedCard from '../components/feed/FeedCard';
import SearchBox from '../components/search/SearchBox';
import SortDropdown from '../components/feed/SortDropdown';

const dummyFeeds = [
  {
    noteId: 101,
    noteTitle: '4485 녹색 옷 입은 애가 젤다지?',
    content: '점화식 설계의 중요성!',
    createdAt: '2025-07-29T14:00:00Z',
    likeCount: 15,
    commentCount: 9,
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
    isLiked: true,
    isFollowing: true,
    user: {
      userId: 1,
<<<<<<< HEAD
      nickname: '알고리듬마스터',
      image: '',
    },
    problem: {
      problemId: 9663,
      problemName: '9663번 N-Queen',
      tier: 5,
      language: 'Python',
    },
    tags: ['백트래킹', 'DFS', '재귀'],
  },
  {
    noteId: 202,
    noteTitle: '1003 피보나치 함수는 DP로!',
    content: '재귀로 풀면 시간초과. DP 점화식 연습용으로 좋습니다.',
    createdAt: '2025-08-01T09:00:00Z',
    likeCount: 120,
    commentCount: 25,
    isLiked: true,
    isFollowing: false,
    user: {
      userId: 2,
      nickname: '초보코린이',
      image: '',
    },
    problem: {
      problemId: 1003,
      problemName: '1003번 피보나치 함수',
      tier: 2,
      language: 'Java',
    },
    tags: ['DP', '수학'],
  },
  {
    noteId: 203,
    noteTitle: '11729 하노이의 탑 이동 순서',
    content: '하노이탑 재귀 구현. 생각보다 간단!',
    createdAt: '2025-07-28T15:00:00Z',
    likeCount: 3,
    commentCount: 1,
    isLiked: false,
    isFollowing: true,
    user: {
      userId: 3,
      nickname: '싸피짱',
      image: '',
    },
    problem: {
      problemId: 11729,
      problemName: '11729번 하노이의 탑',
      tier: 1,
      language: 'C++',
    },
    tags: ['재귀', '시뮬레이션'],
  },
  {
    noteId: 204,
    noteTitle: '1920 수 찾기 - 이진 탐색 vs set',
    content: '탐색은 역시 정렬 후 이진 탐색 or set 활용',
    createdAt: '2025-07-30T13:00:00Z',
    likeCount: 52,
    commentCount: 10,
    isLiked: true,
    isFollowing: false,
    user: {
      userId: 4,
      nickname: '탐색왕',
      image: '',
    },
    problem: {
      problemId: 1920,
      problemName: '1920번 수 찾기',
      tier: 3,
      language: 'TypeScript',
    },
    tags: ['이진탐색', '해시', '정렬'],
  },
  {
    noteId: 205,
    noteTitle: '2606 바이러스 - 그래프 기초',
    content: '기본적인 BFS 문제. 노드 방문 체크만 잘하면 됨',
    createdAt: '2025-07-25T20:00:00Z',
    likeCount: 9,
    commentCount: 0,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 5,
      nickname: '그래프노예',
      image: '',
    },
    problem: {
      problemId: 2606,
      problemName: '2606번 바이러스',
      tier: 2,
      language: 'JavaScript',
    },
    tags: ['BFS', '그래프', '기초'],
  },
  {
    noteId: 206,
    noteTitle: '2343 기타 레슨 - 이분 탐색 최적화',
    content: '구간합 배열 + 이분 탐색으로 최적화하는 문제입니다.',
    createdAt: '2025-08-02T18:00:00Z',
    likeCount: 41,
    commentCount: 12,
    isLiked: false,
    isFollowing: true,
    user: {
      userId: 6,
      nickname: '알고아저씨',
      image: '',
    },
    problem: {
      problemId: 2343,
      problemName: '2343번 기타 레슨',
      tier: 4,
      language: 'Java',
    },
    tags: ['이분탐색', '구현', '누적합'],
  },
  {
    noteId: 207,
    noteTitle: '1697 숨바꼭질',
    content: '최단거리 탐색 문제. BFS 연습에 좋아요!',
    createdAt: '2025-07-31T10:00:00Z',
    likeCount: 0,
    commentCount: 0,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 7,
      nickname: '고독한코더',
      image: '',
    },
    problem: {
      problemId: 1697,
      problemName: '1697번 숨바꼭질',
      tier: 3,
      language: 'Python',
    },
    tags: ['BFS', '최단거리', '큐'],
  },
  {
    noteId: 208,
    noteTitle: '1932 정수 삼각형 - DP의 진수',
    content: '위에서 아래로 내려오며 최댓값을 기록하는 DP',
    createdAt: '2025-07-29T12:00:00Z',
    likeCount: 77,
    commentCount: 21,
    isLiked: true,
    isFollowing: false,
    user: {
      userId: 8,
      nickname: 'DP장인',
      image: '',
    },
    problem: {
      problemId: 1932,
      problemName: '1932번 정수 삼각형',
      tier: 4,
      language: 'C++',
    },
    tags: ['DP', '누적합', '2차원배열'],
  },
];

export default function ExplorePage() {
  const [sortBy, setSortBy] = useState("latest");
  const [userScope, setUserScope] = useState<'all' | 'following'>("all");

  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTags, setSearchTags] = useState<string[]>([]);

  /**
   * SearchBox에서 전달한 검색 조건 처리
   */
  const handleSearch = (params: {
    keyword: string;
    tags: string[];
  }) => {
    setSearchKeyword(params.keyword);
    setSearchTags(params.tags);
  };

  // ✅ 정렬
  const sortedFeeds = [...dummyFeeds].sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return b.likeCount - a.likeCount;
      case 'comments':
        return b.commentCount - a.commentCount;
      default:
=======
      nickname: '김싸피',
      image: '',
    },
    problem: {
      problemId: 4485,
      problemName: '4485번 젤다',
      tier: 5,
      language: 'Java',
    },
    tags: ['DP', 'dfs', '백트래킹', '최단거리', '우선순위큐'],
  },
  {
    noteId: 102,
    noteTitle: '1991 DFS와 BFS는 언제 나누는가?',
    content: '이 문제는 큐와 스택을 동시에 떠올려야 풀 수 있다.',
    createdAt: '2025-07-30T08:00:00Z',
    likeCount: 8,
    commentCount: 3,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 2,
      nickname: '한싸피',
      image: '',
    },
    problem: {
      problemId: 1991,
      problemName: '1991번 트리 순회',
      tier: 3,
      language: 'Python',
    },
    tags: ['BFS', 'DFS', '트리'],
  },
  {
    noteId: 103,
    noteTitle: '9012 괄호는 여는 게 먼저야',
    content: '스택 자료구조의 기본을 다지는 문제!',
    createdAt: '2025-07-28T17:30:00Z',
    likeCount: 27,
    commentCount: 5,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 3,
      nickname: '바',
      image: '',
    },
    problem: {
      problemId: 9012,
      problemName: '9012번 괄호',
      tier: 2,
      language: 'C++',
    },
    tags: ['스택', '자료구조', '시뮬레이션'],
  },
  {
    noteId: 103,
    noteTitle: '9012 괄호는 여는 게 먼저야',
    content: '스택 자료구조의 기본을 다지는 문제!',
    createdAt: '2025-07-28T17:30:00Z',
    likeCount: 27,
    commentCount: 5,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 3,
      nickname: '바',
      image: '',
    },
    problem: {
      problemId: 9012,
      problemName: '9012번 괄호',
      tier: 2,
      language: 'C++',
    },
    tags: ['스택', '자료구조', '시뮬레이션'],
  },
  {
    noteId: 103,
    noteTitle: '9012 괄호는 여는 게 먼저야',
    content: '스택 자료구조의 기본을 다지는 문제!',
    createdAt: '2025-07-28T17:30:00Z',
    likeCount: 27,
    commentCount: 5,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 3,
      nickname: '바',
      image: '',
    },
    problem: {
      problemId: 9012,
      problemName: '9012번 괄호',
      tier: 2,
      language: 'C++',
    },
    tags: ['스택', '자료구조', '시뮬레이션'],
  },
  {
    noteId: 103,
    noteTitle: '9012 괄호는 여는 게 먼저야',
    content: '스택 자료구조의 기본을 다지는 문제!',
    createdAt: '2025-07-28T17:30:00Z',
    likeCount: 27,
    commentCount: 5,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 3,
      nickname: '바',
      image: '',
    },
    problem: {
      problemId: 9012,
      problemName: '9012번 괄호',
      tier: 2,
      language: 'C++',
    },
    tags: ['스택', '자료구조', '시뮬레이션'],
  },
  {
    noteId: 103,
    noteTitle: '9012 괄호는 여는 게 먼저야',
    content: '스택 자료구조의 기본을 다지는 문제!',
    createdAt: '2025-07-28T17:30:00Z',
    likeCount: 27,
    commentCount: 5,
    isLiked: false,
    isFollowing: false,
    user: {
      userId: 3,
      nickname: '바',
      image: '',
    },
    problem: {
      problemId: 9012,
      problemName: '9012번 괄호',
      tier: 2,
      language: 'C++',
    },
    tags: ['스택', '자료구조', '시뮬레이션'],
  },
];

export default function FeedPage() {
  const handleSearch = (params: {
    keyword: string;
    tags: string[];
    userScope?: 'all' | 'following';
  }) => {
    console.log('검색 조건:', params);
  };

  const [sortBy, setSortBy] = useState("latest");

  const sortedFeeds = [...dummyFeeds].sort((a, b) => {
    switch (sortBy) {
      case "likes":
        return b.likeCount - a.likeCount;
      case "comments":
        return b.commentCount - a.commentCount;
      default: // 최신순
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

<<<<<<< HEAD
  // ✅ 필터링 (스코프 + 키워드 + 태그)
  const visibleFeeds = sortedFeeds.filter((feed) => {
    const inScope = userScope === 'all' || feed.isFollowing;
    const matchesKeyword = searchKeyword === '' || feed.noteTitle.includes(searchKeyword) || feed.content.includes(searchKeyword);
    const matchesTags = searchTags.length === 0 || searchTags.every(tag => feed.tags.includes(tag));
    return inScope && matchesKeyword && matchesTags;
  });

  return (
    <main className="flex-1 px-18 py-5 bg-[#F8F9FA]">
      <div className="max-w-[1100px] mx-auto space-y-6">
        {/* 🔹 유저 스코프 탭 */}
        <SearchUserScopeTabs
          value={userScope}
          onChange={(val) => setUserScope(val)}
        />

        {/* 🔹 키워드 + 태그 + 정렬 */}
        <SearchBox
          onSearch={handleSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* 🔹 피드 목록 */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-y-6">
          {visibleFeeds.map((feed) => (
            <FeedCard 
              key={feed.noteId + feed.createdAt}
              noteTitle={feed.noteTitle}
              content={feed.content}
              createdAt={feed.createdAt}
              user={feed.user}
              problem={feed.problem}
              tags={feed.tags}
              likeCount={feed.likeCount}
              commentCount={feed.commentCount}
              isLiked={feed.isLiked}
              isFollowing={feed.isFollowing}
            />
=======
  return (
    <main className="flex-1 px-18 py-5 bg-[#F8F9FA]">
      <div className="max-w-[1100px] mx-auto space-y-6">
        {/* 검색 박스 */}
        <SearchBox
          showUserScopeTabs
          defaultUserScope="all"
          onSearch={handleSearch}
        />

        {/* 정렬 드롭다운 */}
        <SortDropdown selected={sortBy} onChange={setSortBy} />

        {/* 피드 카드 목록 (정렬된 배열 사용!) */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-y-6">
          {sortedFeeds.map((feed) => (
            <FeedCard key={feed.noteId + feed.createdAt} {...feed} />
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
          ))}
        </div>
      </div>
    </main>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
