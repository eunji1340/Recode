// src/pages/UserDetailPage.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import ProfileHeader from './mypage/dashboard/ProfileHeader';
import SearchBox from '../components/search/SearchBox';
import FeedCard from '../components/feed/FeedCard';
import EmptyState from '../components/feed/EmptyFeedState';
import { useInfiniteFeeds } from '../hooks/useInfiniteFeeds';
import { useFollow } from '../hooks/useFollow';
import { fetchUserFeeds } from '../api/feed';
import { fetchAllUserDashboardData, fetchFollowDetails } from '../api/user';
import type { UserDashboardData } from '../api/user';
import type { ExploreFeedCardData } from '../types/feed';
import type { FollowDetail } from './mypage/dashboard/FollowModal';
import FollowModal from './mypage/dashboard/FollowModal';

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const myUserId = useUserStore((state) => state.userId);
  const navigate = useNavigate();

  const [user, setUser] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 팔로우 모달 상태
  const [followOpen, setFollowOpen] = useState(false);
  const [followTab, setFollowTab] = useState<'followers' | 'followings'>('followers');
  const [followDetails, setFollowDetails] = useState<FollowDetail[]>([]);
  const [followLoading, setFollowLoading] = useState(false);

  // 검색 상태
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const [resetKey, setResetKey] = useState(0);

  // 팔로우 상태
  const { following, toggleFollow, setFollowing } = useFollow(false, Number(userId));

  // 피드 데이터 로드
  const {
    dataList: feeds,
    isLoading: feedsLoading,
    observerRef,
    updateFollowState,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    (params) => fetchUserFeeds({ ...params, userId: Number(userId) }),
    useMemo(() => ({ search, tag }), [search, tag]),
    15,
    resetKey
  );

  // 본인 페이지 접근 시 마이페이지로 이동
  useEffect(() => {
    if (!userId) return;
    if (Number(myUserId) === Number(userId)) {
      navigate(`/users/${myUserId}`, { replace: true });
      return;
    }

    setLoading(true);
    setError(null);

    fetchAllUserDashboardData(userId)
      .then((userData) => setUser(userData))
      .catch(() => setError('유저 정보를 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));

    fetchFollowDetails(String(myUserId), 'followings')
      .then((list) => {
        const exists = list.some((f) => f.userId === Number(userId));
        setFollowing(exists);
      })
      .catch(() => setFollowing(false));
  }, [userId, myUserId, navigate, setFollowing]);

  // 팔로우 상태 동기화
  const syncFollowState = useCallback(
    (newState: boolean) => {
      setFollowing(newState); // 프로필 헤더
      updateFollowState(Number(userId), newState); // 모든 피드카드 반영
    },
    [setFollowing, updateFollowState, userId]
  );

  // 팔로우 토글
  const handleToggleFollow = useCallback(async () => {
    const newState = !following;
    try {
      await toggleFollow();
      syncFollowState(newState);
    } catch (e) {
      console.error('팔로우 토글 실패:', e);
    }
  }, [following, toggleFollow, syncFollowState]);

  // FeedCard에서 팔로우 토글
  const handleFeedCardFollowToggle = useCallback(
    (targetUserId: number, newState: boolean) => {
      if (targetUserId === Number(userId)) {
        syncFollowState(newState);
      } else {
        updateFollowState(targetUserId, newState);
      }
    },
    [userId, syncFollowState, updateFollowState]
  );

  // 팔로우 모달 열기
  const handleOpenFollowModal = useCallback(
    async (type: 'followers' | 'followings') => {
      if (!userId) return;
      setFollowTab(type);
      setFollowOpen(true);
      setFollowLoading(true);
      try {
        const details = await fetchFollowDetails(userId, type);
        setFollowDetails(details);
      } catch {
        setFollowDetails([]);
      } finally {
        setFollowLoading(false);
      }
    },
    [userId]
  );

  /** 검색 실행 - 최신 키워드/태그 값으로 실행 */
  const handleSearch = useCallback((nextKeyword: string, nextTag: string) => {
    setKeyword(nextKeyword);
    setTag(nextTag);
    setSearch(nextKeyword);
    setResetKey((v) => v + 1);
  }, []);

  // 전체 초기화
  const handleResetFilters = useCallback(() => {
    setKeyword('');
    setSearch('');
    setTag('');
    setResetKey((v) => v + 1);
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-8 text-[#0B0829] ">
      <div className="max-w-screen-xl mx-auto space-y-6">
        {/* 프로필 헤더 */}
        <ProfileHeader
          nickname={user.nickname}
          bojId={user.bojId}
          bio={user.bio}
          userTier={user.userTier}
          image={user.image}
          followerCount={user.followerCount}
          followingCount={user.followingCount}
          isFollowing={following}
          onToggleFollow={handleToggleFollow}
          onOpenModal={handleOpenFollowModal}
        />

        {/* 팔로우 모달 */}
        <FollowModal
          open={followOpen}
          activeTab={followTab}
          details={followDetails}
          loading={followLoading}
          onClose={() => setFollowOpen(false)}
          onTabChange={handleOpenFollowModal}
        />

        {/* 검색 박스 */}
        <SearchBox
          keyword={keyword}
          onKeywordChange={setKeyword}
          tag={tag}
          onTagChange={setTag}
          onSearch={handleSearch}
          onClearAll={handleResetFilters}
        />

        {feedsLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">오답노트를 불러오는 중...</p>
          </div>
        ) : feeds.length === 0 ? (
          <EmptyState
            title="아직 작성된 오답노트가 없습니다"
            description="이 사용자가 작성한 오답노트가 없습니다."
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {feeds.map((feed) => (
              <FeedCard
                key={feed.noteId}
                {...feed}
                onToggleFollow={handleFeedCardFollowToggle}
              />
            ))}
            <div ref={observerRef} className="h-1" />
            {feedsLoading && feeds.length > 0 && (
              <div className="w-full text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8400] mx-auto"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}