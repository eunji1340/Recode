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

  // 검색 상태 - 입력용과 실제 검색용 분리
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');
  
  // 실제 검색에 사용되는 파라미터
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [resetKey, setResetKey] = useState(0);

  // 팔로우 상태
  const { following, toggleFollow, setFollowing } = useFollow(false, Number(userId));

  // API 파라미터 메모화
  const searchParams = useMemo(() => ({
    search: searchKeyword,
    tag: searchTag,
  }), [searchKeyword, searchTag]);

  // 피드 데이터 로드
  const {
    dataList: feeds,
    isLoading: feedsLoading,
    error: feedsError,
    observerRef,
    updateFollowState,
    retry,
  } = useInfiniteFeeds<ExploreFeedCardData>(
    useCallback((params) => {
      console.log('fetchUserFeeds 호출:', { userId, ...params });
      return fetchUserFeeds({ ...params, userId: Number(userId) });
    }, [userId]),
    searchParams,
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
      .then((userData) => {
        console.log('유저 데이터 로드 완료:', userData);
        setUser(userData);
      })
      .catch((err) => {
        console.error('유저 데이터 로드 실패:', err);
        setError('유저 정보를 불러오는 중 오류가 발생했습니다.');
      })
      .finally(() => setLoading(false));

    // 팔로우 상태 확인
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

  /** 검색 실행 */
  const handleSearch = useCallback((nextKeyword: string, nextTag: string) => {
    console.log('검색 실행:', { nextKeyword, nextTag });
    
    // 입력 상태 업데이트
    setKeyword(nextKeyword);
    setTag(nextTag);
    
    // 실제 검색 파라미터 업데이트
    setSearchKeyword(nextKeyword);
    setSearchTag(nextTag);
    
    // 리셋하여 첫 페이지부터 로드
    setResetKey((v) => v + 1);
  }, []);

  // 전체 초기화
  const handleResetFilters = useCallback(() => {
    console.log('필터 초기화');
    
    setKeyword('');
    setTag('');
    setSearchKeyword('');
    setSearchTag('');
    setResetKey((v) => v + 1);
  }, []);

  // 피드 에러 처리
  if (feedsError) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-8 text-[#0B0829]">
        <div className="max-w-screen-xl mx-auto">
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-8 text-[#0B0829]">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">유저 정보를 불러오는 중...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-8 text-[#0B0829]">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 text-4xl mb-4">!</div>
            <h2 className="text-xl font-semibold text-[#13233D] mb-4">오류 발생</h2>
            <p className="text-[#13233D]/70 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

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

        {/* 피드 컨텐츠 */}
        {feedsLoading && feeds.length === 0 ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
            <p className="text-[#13233D]/70">오답노트를 불러오는 중...</p>
          </div>
        ) : feeds.length === 0 ? (
          <EmptyState
            title="아직 작성된 오답노트가 없습니다"
            description={
              searchKeyword || searchTag
                ? "검색 조건에 맞는 오답노트가 없습니다."
                : "이 사용자가 작성한 오답노트가 없습니다."
            }
            buttonText={searchKeyword || searchTag ? "검색 초기화" : undefined}
            onButtonClick={searchKeyword || searchTag ? handleResetFilters : undefined}
          />
        ) : (
          <div className="flex flex-wrap justify-center items-start gap-3">
            {feeds.map((feed) => (
              <FeedCard
                key={feed.noteId}
                {...feed}
                onToggleFollow={handleFeedCardFollowToggle}
              />
            ))}
            
            {/* 무한 스크롤 트리거 */}
            {feeds.length > 0 && (
              <div 
                ref={observerRef} 
                className="w-full h-1"
                style={{ minHeight: '1px' }}
              />
            )}

            {/* 추가 로딩 */}
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