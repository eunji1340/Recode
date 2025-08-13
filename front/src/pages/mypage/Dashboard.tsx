import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import ProfileHeader from './dashboard/ProfileHeader';
import FollowModal from './dashboard/FollowModal';
import StatsSection from './dashboard/StatsSection';
import StreakSection from './dashboard/StreakSection';
import StreakCalendarModal from './dashboard/StreakCalendarModal';
import { getWeekDays, toKey, buildCountMap, addMonths, startOfMonth } from '../../utils/date';

import type { FollowDetail } from './dashboard/FollowModal';
import type { TagCount } from './dashboard/StatsSection';
import type { DailyCount } from '../../utils/date';

interface UserInfo {
  nickname: string;
  bojId: string;
  bio: string;
  userTier: number;
  followerCount: number;
  followingCount: number;
  image?: string; 
}

// 스켈레톤 로딩 컴포넌트
const SkeletonLoader = () => (
  <div className="container mx-auto p-2 space-y-6 animate-pulse">
    {/* Profile Header Skeleton */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex space-x-4">
        <div className="h-10 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-20"></div>
      </div>
    </div>

    {/* Stats Section Skeleton */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="text-center">
            <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
        ))}
      </div>
      <div className="h-40 bg-gray-200 rounded"></div>
    </div>

    {/* Streak Section Skeleton */}
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
        </div>
        <div className="text-center">
          <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map(i => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// 스피너 로딩 컴포넌트
const SpinnerLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="relative">
      <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary"></div>
    </div>
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-700 mb-1">
        대시보드를 불러오는 중...
      </h3>
      <p className="text-sm text-gray-500">
        잠시만 기다려주세요
      </p>
    </div>
  </div>
);

// 에러 컴포넌트
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-700 mb-1">
        오류가 발생했습니다
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 팔로우 모달 상태
  const [followOpen, setFollowOpen] = useState(false);
  const [followTab, setFollowTab] = useState<'followers' | 'followings'>('followers');
  const [followDetails, setFollowDetails] = useState<FollowDetail[]>([]);
  const [followLoading, setFollowLoading] = useState(false);

  // 태그 통계
  const [totalCount, setTotalCount] = useState(0);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);

  // 스트릭 관련 상태
  const [todayStreak, setTodayStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [dailyRows, setDailyRows] = useState<DailyCount[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));

  // 데이터 로드 함수
  const loadDashboardData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);

    try {
      const [userRes, noteRes, followersRes, followingsRes] = await Promise.all([
        api.get<UserInfo>(`/users/${userId}`),
        api.get<number>(`/notes/note-count?userId=${userId}`),
        api.get<number>(`/follow/followers/count/${userId}`),
        api.get<number>(`/follow/followings/count/${userId}`),
      ]);

      setUser({
        ...userRes.data,
        followerCount: followersRes.data,
        followingCount: followingsRes.data,
      });
      setTotalCount(noteRes.data);
    } catch (err) {
      setError('데이터 로딩 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 사용자 정보, 노트 수, 팔로워/팔로잉 수 로드
  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  // 태그별 통계 로드
  useEffect(() => {
    if (!userId) return;
    api
      .get<TagCount[]>(`/notes/note-count-tag?userId=${userId}`)
      .then(res => {
        const colored = res.data.map((t, idx) => ({
          ...t,
          color: `hsl(${Math.round((360 * idx) / res.data.length)},70%,50%)`,
        }));
        setTagCounts(colored);
      })
      .catch(err => console.error('태그 통계 로딩 실패', err));
  }, [userId]);

  // 모달 열릴 때 팔로우 상세 로드
  useEffect(() => {
    if (!followOpen || !userId) return;
    setFollowLoading(true);
    api
      .get<{ data: { details: FollowDetail[] } }>(`/follow/${followTab}?userId=${userId}`)
      .then(res => setFollowDetails(res.data.data.details))
      .catch(() => setFollowDetails([]))
      .finally(() => setFollowLoading(false));
  }, [followOpen, followTab, userId]);

  // 스트릭 데이터 
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [streakRes, maxStreakRes, rowsRes] = await Promise.all([
          api.get<number>('/notes/note-streak'),
          api.get<number>('/notes/max-streak'),
          api.get<DailyCount[]>('/notes/note-count-date')
        ]);

        setTodayStreak(streakRes.data);
        setMaxStreak(maxStreakRes.data);
        setDailyRows(rowsRes.data || []);
      } catch (err) {
        console.error('스트릭 데이터 로딩 실패:', err);
      }
    })();
  }, [userId]);

  // 주간 데이터(월~일) 구성
  const week = useMemo(() => {
    const map = buildCountMap(dailyRows);
    const days = getWeekDays(new Date());
    return days.map(d => ({ date: d, count: map[toKey(d)] ?? 0 }));
  }, [dailyRows]);

  // 모달용 월간 카운트 맵
  const monthCountMap = useMemo(() => buildCountMap(dailyRows), [dailyRows]);

  // 상태 관리
  if (loading) {
    return (
      <div className="container mx-auto p-2">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8400] mx-auto mb-4"></div>
          <p className="text-zinc-500">대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-2">
        <div className="text-center py-20">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <>
      <div className="container mx-auto p-2">
        <ProfileHeader
          nickname={user.nickname}
          bojId={user.bojId}
          bio={user.bio}
          userTier={user.userTier}
          followerCount={user.followerCount}
          followingCount={user.followingCount}
          image={user.image}
          onOpenModal={(type) => {
            setFollowTab(type);
            setFollowOpen(true);
          }}
        />
      </div>

      <FollowModal
        open={followOpen}
        activeTab={followTab}
        details={followDetails}
        loading={followLoading}
        onClose={() => setFollowOpen(false)}
        onTabChange={setFollowTab}
      />

      <div className="container mx-auto p-2">
        <StatsSection
          totalCount={totalCount} 
          tagCounts={tagCounts}
          nickname={user.nickname} 
        />
      </div>

      <div className="container mx-auto p-2">
        <StreakSection
          todayStreak={todayStreak}
          maxStreak={maxStreak}
          week={week}
          onOpenCalendar={() => {
            setCalendarOpen(true);
            setCalendarMonth(startOfMonth(new Date()));
          }}
        />

        <StreakCalendarModal
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          monthBase={calendarMonth}
          counts={monthCountMap}
          onPrevMonth={() => setCalendarMonth(m => addMonths(m, -1))}
          onNextMonth={() => setCalendarMonth(m => addMonths(m, 1))}
        />
      </div>
    </>
  );
}