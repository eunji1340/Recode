// src/pages/FeedPage.tsx
import React from 'react';
import FeedCard from '../components/feed/FeedCard'; // 경로는 실제 구조에 맞게 수정

const FeedPage = () => {
  // 임시 더미 데이터
  const dummyFeeds = [
        {
        level: 5,
        title: '4485 녹색 옷 입은 애가 젤다지?',
        content: '점화식 설계의 중요성!',
        timeAgo: '1일 전',
        nickname: '김싸피',
        language: 'Java',
        tags: ['DP', 'dfs', '태그', '태그', '태그'],
        likes: 15,
        comments: 9,
        liked: true,
    },
    {
        level: 3,
        title: '1991 DFS와 BFS는 언제 나누는가?',
        content: '이 문제는 큐와 스택을 동시에 떠올려야 풀 수 있다.',
        timeAgo: '3시간 전',
        nickname: '한싸피',
        language: 'Python',
        tags: ['bfs', '자료구조', '탐색'],
        likes: 8,
        comments: 3,
        liked: false,
    },
    {        
        level: 2,
        title: '9012 괄호는 여는 게 먼저야',
        content: '스택 자료구조의 기본을 다지는 문제!',
        timeAgo: '2일 전',
        nickname: '박싸피',
        language: 'C++',
        tags: ['자료구조', '스택', '시뮬레이션'],
        likes: 27,
        comments: 5,
        liked: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 flex flex-wrap gap-6 justify-center">
      {dummyFeeds.map((feed, idx) => (
        <FeedCard key={idx} {...feed} />
      ))}
    </div>
  );
};

export default FeedPage;