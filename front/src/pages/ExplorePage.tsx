import React, { useState } from 'react';
import FeedCard from '../components/feed/FeedCard';
import SearchBox from '../components/search/SearchBox';
import SortDropdown from '../components/feed/SortDropdown';
import { Link } from 'react-router-dom';

const dummyFeeds = [
  {
    noteId: 101,
    noteTitle: '4485 녹색 옷 입은 애가 젤다지?',
    content: '점화식 설계의 중요성!',
    createdAt: '2025-07-29T14:00:00Z',
    likeCount: 15,
    commentCount: 9,
    isLiked: true,
    isFollowing: true,
    user: {
      userId: 1,
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

  const [sortBy, setSortBy] = useState('latest');

  const sortedFeeds = [...dummyFeeds].sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return b.likeCount - a.likeCount;
      case 'comments':
        return b.commentCount - a.commentCount;
      default: // 최신순
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

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
            <Link to={`/notes/${feed.noteId}`}>
              <FeedCard key={feed.noteId + feed.createdAt} {...feed} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
