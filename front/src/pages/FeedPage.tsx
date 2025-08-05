import React, { useState } from 'react';
import MainFeed from '../components/feed/MainFeed';
import SearchBox from '../components/search/SearchBox';

/**
 * FeedPage - 메인 피드 페이지
 * - 상단: 검색창(SearchBox)
 * - 하단: 정렬 기준에 따라 피드(MainFeed) 목록 출력
 */
const FeedPage = () => {
  // 🔸 정렬 기준 상태
  const [sortBy, setSortBy] = useState<
    'latest' | 'likes' | 'views' | 'comments'
  >('latest');

  // 🔸 더미 피드 목록 (API 연동 전 임시 데이터)
  const dummyFeeds = [
    {
      noteId: 1,
      noteTitle: 'DFS의 종료 조건 실수',
      content:
        'DFS를 구현할 때 방문 체크를 하지 않으면 무한 루프에 빠질 수 있습니다. 이 문제에서 visited 체크를 빠뜨려 스택 오버플로우가 발생했습니다.',
      successCode: `def dfs(v):\n  visited[v] = True\n  for u in graph[v]:\n    if not visited[u]:\n      dfs(u)`,
      successCodeStart: 1,
      successCodeEnd: 5,
      failCode: `def dfs(v):\n  for u in graph[v]:\n    dfs(u)`,
      failCodeStart: 1,
      failCodeEnd: 3,
      createdAt: '2025-07-30T10:00:00Z',
      viewCount: 78,
      likeCount: 14,
      commentCount: 1,
      isLiked: false,
      user: { userId: 1, nickname: 'dfs_maniac', image: '' },
      problem: {
        problemId: 1001,
        problemName: '11724 연결 요소의 개수',
        tier: 6,
        language: 'Python',
      },
      tags: ['DFS', '그래프', '기초'],
    },
    {
      noteId: 2,
      noteTitle: '정렬 후 이분 탐색 범위 오류',
      content:
        '이분 탐색을 구현할 때 left/right 경계를 잘못 지정해 원하는 값을 찾지 못했습니다. mid 계산 후 업데이트 로직을 신중히 설계해야 합니다.',
      successCode: `def binary_search(arr, target):\n  left, right = 0, len(arr)-1\n  while left <= right:\n    mid = (left + right) // 2\n    if arr[mid] == target:\n      return mid\n    elif arr[mid] < target:\n      left = mid + 1\n    else:\n      right = mid - 1`,
      successCodeStart: 1,
      successCodeEnd: 8,
      failCode: `def binary_search(arr, target):\n  for i in range(len(arr)):\n    if arr[i] == target:\n      return i`,
      failCodeStart: 1,
      failCodeEnd: 4,
      createdAt: '2025-08-01T12:00:00Z',
      viewCount: 120,
      likeCount: 20,
      commentCount: 3,
      isLiked: true,
      user: { userId: 2, nickname: '탐색러', image: '' },
      problem: {
        problemId: 1920,
        problemName: '수 찾기',
        tier: 5,
        language: 'C++',
      },
      tags: ['이분탐색', '정렬', '탐색'],
    },
    {
      noteId: 3,
      noteTitle: 'BFS 큐 사용 방식 실수',
      content:
        'BFS 구현 시 큐 대신 스택을 사용하여 탐색 순서가 꼬였습니다. 큐는 FIFO 구조로 정확한 순서 유지를 위해 deque 사용을 권장합니다.',
      successCode: `from collections import deque\ndef bfs(v):\n  q = deque([v])\n  visited[v] = True\n  while q:\n    cur = q.popleft()\n    for nxt in graph[cur]:\n      if not visited[nxt]:\n        visited[nxt] = True\n        q.append(nxt)`,
      successCodeStart: 1,
      successCodeEnd: 9,
      failCode: `def bfs(v):\n  stack = [v]\n  while stack:\n    cur = stack.pop()\n    for nxt in graph[cur]:\n      stack.append(nxt)`,
      failCodeStart: 1,
      failCodeEnd: 6,
      createdAt: '2025-08-03T14:30:00Z',
      viewCount: 98,
      likeCount: 10,
      commentCount: 2,
      isLiked: false,
      user: { userId: 3, nickname: '큐장인', image: '' },
      problem: {
        problemId: 1260,
        problemName: 'DFS와 BFS',
        tier: 7,
        language: 'Java',
      },
      tags: ['BFS', '큐', '그래프'],
    },
    {
      noteId: 4,
      noteTitle: 'DP 점화식 초기화 실수',
      content:
        'DP 배열을 선언할 때 기본값 설정을 잘못해 틀렸습니다. 최소값 문제에서는 inf, 최대값은 -1 등으로 초기화하는 습관이 필요합니다.',
      successCode: `dp = [float('inf')] * (n+1)\ndp[0] = 0\nfor i in range(1, n+1):\n  for coin in coins:\n    if i - coin >= 0:\n      dp[i] = min(dp[i], dp[i - coin] + 1)`,
      successCodeStart: 1,
      successCodeEnd: 6,
      failCode: `dp = [0] * n\nfor i in range(n):\n  dp[i] = min(dp[i-1], dp[i-2]) + cost[i]`,
      failCodeStart: 1,
      failCodeEnd: 3,
      createdAt: '2025-08-02T11:00:00Z',
      viewCount: 65,
      likeCount: 5,
      commentCount: 1,
      isLiked: true,
      user: { userId: 4, nickname: 'dp초보', image: '' },
      problem: {
        problemId: 2293,
        problemName: '동전 1',
        tier: 10,
        language: 'Python',
      },
      tags: ['DP', '점화식', '최적화'],
    },
    {
      noteId: 5,
      noteTitle: '문자열 split 실수',
      content:
        '문자열 split 시 기준 문자를 잘못 지정해 의도한 결과가 나오지 않았습니다. 입력 구분자에 따라 정확한 분리 기준을 명시해야 합니다.',
      successCode: `data = input().split(',')\nfor d in data:\n  print(d.strip())`,
      successCodeStart: 1,
      successCodeEnd: 3,
      failCode: `data = input().split()\nfor d in data:\n  print(d)`,
      failCodeStart: 1,
      failCodeEnd: 3,
      createdAt: '2025-07-28T09:00:00Z',
      viewCount: 45,
      likeCount: 2,
      commentCount: 0,
      isLiked: false,
      user: { userId: 5, nickname: 'stringer', image: '' },
      problem: {
        problemId: 1152,
        problemName: '단어의 개수',
        tier: 3,
        language: 'Python',
      },
      tags: ['문자열', 'split', '파싱'],
    },
  ];

  // 🔸 정렬 기준에 따라 피드 정렬
  const sortedFeeds = [...dummyFeeds].sort((a, b) => {
    switch (sortBy) {
      case 'likes':
        return b.likeCount - a.likeCount;
      case 'views':
        return b.viewCount - a.viewCount;
      case 'comments':
        return b.commentCount - a.commentCount;
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  });

  //   TODO: detail 페이지로의 router 달기
  return (
    <main className="flex flex-col items-center bg-[#F8F9FA] py-6">
      {/* 🔹 검색창 */}
      <div className="w-full max-w-[1100px] mb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <SearchBox
            onSearch={() => {}}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {/* 🔹 피드 목록 */}
      <div className="w-full max-w-[1100px] flex flex-col gap-6">
        {sortedFeeds.map((item) => (
          <MainFeed key={`${item.noteId}-${item.user.userId}`} {...item} />
        ))}
      </div>
    </main>
  );
};

export default FeedPage;
