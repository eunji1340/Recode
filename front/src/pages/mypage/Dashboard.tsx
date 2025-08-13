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
  // 이 부분을 추가했습니다.
  image?: string; 
}

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


  
  // 사용자 정보, 노트 수, 팔로워/팔로잉 수 로드
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    Promise.all([
      api.get<UserInfo>(`/users/${userId}`),
      api.get<number>(`/notes/note-count?userId=${userId}`),
      api.get<number>(`/follow/followers/count/${userId}`),
      api.get<number>(`/follow/followings/count/${userId}`),
    ])
      .then(([userRes, noteRes, followersRes, followingsRes]) => {
        setUser({
          ...userRes.data,
          followerCount: followersRes.data,
          followingCount: followingsRes.data,
        });
        setTotalCount(noteRes.data);
      })
      .catch(() => setError('데이터 로딩 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
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
      // 오늘 기준 스트릭 유지일 수
      const { data: streak } = await api.get<number>('/notes/note-streak', {
      });
      setTodayStreak(streak);

      const { data: maxStreak } = await api.get<number>(`/notes/max-streak`);
      setMaxStreak(maxStreak);
      // 일자별 노트 개수 (최근 N일 반환 가정)
      const { data: rows } = await api.get<DailyCount[]>('/notes/note-count-date', {
      });
      setDailyRows(rows || []);
    })().catch(console.error);
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
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
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
          // 이 부분을 추가했습니다.
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
            setCalendarMonth(startOfMonth(new Date())); // 캘린더를 열 때마다 현재 달로 재설정
          }}
          />

      <StreakCalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        monthBase={calendarMonth}          // 이번 달
        counts={monthCountMap}
        onPrevMonth={() => setCalendarMonth(m => addMonths(m, -1))} // 이전 달
        onNextMonth={() => setCalendarMonth(m => addMonths(m, 1))} // 다음 달
      />
      </div>
    </>
  );
}
