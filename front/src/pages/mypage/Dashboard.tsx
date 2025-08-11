// src/pages/mypage/dashboard/Dashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import ProfileHeader from './dashboard/ProfileHeader';
import FollowModal from './dashboard/FollowModal';
import StatsSection from './dashboard/StatsSection';
import StreakSection from './dashboard/StreakSection';
import StreakCalendarModal from './dashboard/StreakCalendarModal';
import { getWeekDays, toKey, buildCountMap, addMonths, startOfMonth } from '../../utils/date';
import type { UserDashboardData } from '../../api/user';
import {
  fetchAllUserDashboardData,
  fetchAllUserStreakData,
  fetchUserTagCounts,
} from '../../api/user';
import type { FollowDetail } from './dashboard/FollowModal';
import type { TagCount } from './dashboard/StatsSection';
import type { DailyCount } from '../../utils/date';

export default function Dashboard() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [followOpen, setFollowOpen] = useState(false);
  const [followTab, setFollowTab] = useState<'followers' | 'followings'>('followers');
  const [followDetails, setFollowDetails] = useState<FollowDetail[]>([]);
  const [followLoading, setFollowLoading] = useState(false);

  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);

  const [todayStreak, setTodayStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [dailyRows, setDailyRows] = useState<DailyCount[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));

  // 모든 대시보드 데이터를 한 번에 로드
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const [dashboardData, tagsRes, streakData] = await Promise.all([
          fetchAllUserDashboardData(userId),
          fetchUserTagCounts(userId),
          fetchAllUserStreakData(userId),
        ]);

        setUser(dashboardData);
        setTagCounts(tagsRes.map((t, idx) => ({
          ...t,
          color: `hsl(${Math.round((360 * idx) / tagsRes.length)},70%,50%)`,
        })));
        setTodayStreak(streakData.todayStreak);
        setMaxStreak(streakData.maxStreak);
        setDailyRows(streakData.dailyRows);
      } catch (e) {
        console.error('데이터 로딩 중 오류 발생:', e);
        setError('데이터 로딩 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userId]);

  // 팔로우 모달 열릴 때 상세 정보 로드
  useEffect(() => {
    if (!followOpen || !userId) return;
    setFollowLoading(true);
    api.get<{ data: { details: FollowDetail[] } }>(`/follow/${followTab}?userId=${userId}`)
      .then(res => setFollowDetails(res.data.data.details))
      .catch(() => setFollowDetails([]))
      .finally(() => setFollowLoading(false));
  }, [followOpen, followTab, userId]);

  // 주간 데이터 (월~일) 구성
  const week = useMemo(() => {
    const map = buildCountMap(dailyRows);
    const days = getWeekDays(new Date());
    return days.map(d => ({ date: d, count: map[toKey(d)] ?? 0 }));
  }, [dailyRows]);

  // 모달용 월간 카운트 맵
  const monthCountMap = useMemo(() => buildCountMap(dailyRows), [dailyRows]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return null;

  return (
    <>
      <div className="container mx-auto p-2 space-y-3">
        <ProfileHeader
          nickname={user.nickname}
          bojId={user.bojId}
          bio={user.bio}
          userTier={user.userTier}
          image={user.image}
          followerCount={user.followerCount}
          followingCount={user.followingCount}
          onOpenModal={(type) => {
            setFollowTab(type);
            setFollowOpen(true);
          }}
        />
        <FollowModal
          open={followOpen}
          activeTab={followTab}
          details={followDetails}
          loading={followLoading}
          onClose={() => setFollowOpen(false)}
          onTabChange={setFollowTab}
        />
        <StatsSection
          totalCount={user.noteCount}
          tagCounts={tagCounts}
          nickname={user.nickname}
        />
        {/* dailyRows 데이터가 로드된 후에만 StreakSection을 렌더링합니다. */}
        {dailyRows.length > 0 && (
          <StreakSection
            todayStreak={todayStreak}
            maxStreak={maxStreak}
            week={week}
            onOpenCalendar={() => setCalendarOpen(true)}
          />
        )}
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