// src/pages/mypage/dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import ProfileHeader from './dashboard/ProfileHeader';
import FollowModal from './dashboard/FollowModal';
import StatsSection from './dashboard/StatsSection';

import type { FollowDetail } from './dashboard/FollowModal';
import type { TagCount } from './dashboard/StatsSection';
interface UserInfo {
  nickname: string;
  bojId: string;
  bio: string;
  userTier: number;
  followerCount: number;
  followingCount: number;
}

export default function Dashboard() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 팔로우 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'followers' | 'followings'>('followers');
  const [modalDetails, setModalDetails] = useState<FollowDetail[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // 태그 통계 상태
  const [totalCount, setTotalCount] = useState(0);
  const [tagCounts, setTagCounts] = useState<TagCount[]>([]);

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
    if (!modalOpen || !userId) return;
    setModalLoading(true);
    api
      .get<{ data: { details: FollowDetail[] } }>(`/follow/${activeTab}?userId=${userId}`)
      .then(res => setModalDetails(res.data.data.details))
      .catch(() => setModalDetails([]))
      .finally(() => setModalLoading(false));
  }, [modalOpen, activeTab, userId]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return null;

  return (
    <>
      <div className="container mx-auto p-6">
        <ProfileHeader
          nickname={user.nickname}
          bojId={user.bojId}
          bio={user.bio}
          userTier={user.userTier}
          followerCount={user.followerCount}
          followingCount={user.followingCount}
          onOpenModal={(type) => {
            setActiveTab(type);
            setModalOpen(true);
          }}
        />
      </div>

      <FollowModal
        open={modalOpen}
        activeTab={activeTab}
        details={modalDetails}
        loading={modalLoading}
        onClose={() => setModalOpen(false)}
        onTabChange={setActiveTab}
      />

      <div className="container mx-auto p-6">
        <StatsSection totalCount={totalCount} tagCounts={tagCounts} />
      </div>
    </>
  );
}
