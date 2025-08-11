import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
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
import type { ExploreFeedCardData, SortOption } from '../types/feed';
import type { FollowDetail } from './mypage/dashboard/FollowModal';
import FollowModal from './mypage/dashboard/FollowModal';

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const myUserId = useUserStore(state => state.userId);

  const [user, setUser] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 팔로우 모달 상태
  const [followOpen, setFollowOpen] = useState(false);
  const [followTab, setFollowTab] = useState<'followers' | 'followings'>('followers');
  const [followDetails, setFollowDetails] = useState<FollowDetail[]>([]);
  const [followLoading, setFollowLoading] = useState(false);

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagForQuery, setTagForQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');

  const { isFollowing, toggleFollow, setIsFollowing } = useFollow(false, Number(userId));

  // 유저 정보 + 팔로잉 여부 로드
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    fetchAllUserDashboardData(userId)
      .then(userData => setUser(userData))
      .catch(() => setError('유저 정보를 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));

    // 내 팔로잉 목록 가져와서 userId 포함 여부 확인
    if (myUserId && Number(myUserId) !== Number(userId)) {
      fetchFollowDetails(String(myUserId), 'followings')
        .then(list => {
          const exists = list.some(f => f.userId === Number(userId));
          setIsFollowing(exists);
        })
        .catch(() => setIsFollowing(false));
    }
  }, [userId, myUserId, setIsFollowing]);

  // 팔로우 모달 열릴 때 상세 정보 로드
  const handleOpenFollowModal = useCallback(async (type: 'followers' | 'followings') => {
    if (!userId) return;
    setFollowTab(type);
    setFollowOpen(true);
    setFollowLoading(true);
    try {
      const details = await fetchFollowDetails(userId, type);
      setFollowDetails(details);
    } catch (e) {
      console.error(e);
      setFollowDetails([]);
    } finally {
      setFollowLoading(false);
    }
  }, [userId]);

  // 검색 및 정렬 파라미터를 메모이제이션하여 불필요한 리렌더링 방지
  const searchParams = useMemo(() => ({
    search,
    tag: tagForQuery,
    sortType: sortBy,
  }), [search, tagForQuery, sortBy]);

  // useInfiniteFeeds 훅에 정렬 파라미터가 정확히 전달되고 있는지 확인
  // sortBy가 변경되면 searchParams가 새로 생성되어 훅이 데이터를 다시 불러와야 합니다.
  const {
    dataList: feeds,
    isLoading: feedsLoading,
    observerRef,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    (params) => fetchUserFeeds({ ...params, userId: Number(userId) }),
    searchParams,
    15
  );

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return null;

  const isMyPage = Number(myUserId) === Number(userId);

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-8 text-[#0B0829]">
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
          isFollowing={!isMyPage && isFollowing} // 내 페이지면 버튼 안보임
          onToggleFollow={!isMyPage ? toggleFollow : undefined}
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

        {/* 검색 및 피드 목록 */}
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

        {feedsLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">오답노트를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {feeds.length === 0 ? (
              <EmptyState
                title="아직 작성된 오답노트가 없습니다"
                description="이 사용자가 작성한 오답노트가 없습니다."
              />
            ) : (
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 mt-8">
                {feeds.map(feed => (
                  <FeedCard key={feed.noteId} {...feed} />
                ))}
                <div ref={observerRef} className="h-1" />
                {feedsLoading && feeds.length > 0 && (
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
