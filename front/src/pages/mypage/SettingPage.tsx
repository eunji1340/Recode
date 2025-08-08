import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSummary from '../mypage/settings/ProfileSummary';
import BasicInfoList from '../mypage/settings/BasicInfoList';
import Button from '../../components/common/Button';
import { fetchMyInfo, deleteUser } from '../../api/user';
import type { UserProfile } from '../../types/user';
import { useUserStore } from '../../stores/userStore';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userId, clearToken } = useUserStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 수정 모드를 각 섹션별로 관리
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isInfoEditing] = useState(false); // 기본 정보 수정 상태

  useEffect(() => {
    const loadMyInfo = async () => {
      if (!userId) {
        setError('로그인이 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const myInfo = await fetchMyInfo();
        setProfile(myInfo);
      } catch (err) {
        setError('정보를 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMyInfo();
  }, [userId]);

  const handleDelete = async () => {
    if (!userId) return;

    try {
      await deleteUser(userId);
      alert('회원 탈퇴가 완료되었습니다.');
      clearToken();
      navigate('/');
    } catch (err) {
      setError('회원 탈퇴에 실패했습니다.');
      console.error(err);
    } finally {
      setIsModalOpen(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg font-medium mb-2">{error}</div>
          <Button onClick={() => navigate('/')}>홈으로 가기</Button>
        </div>
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-slate-500">사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-3">

      {/* 프로필 요약 */}
      <ProfileSummary 
        me={profile} 
        isEditing={isProfileEditing} 
        onEditToggle={() => setIsProfileEditing(!isProfileEditing)} 
      />

      {/* 기본 정보 영역 */}
      <BasicInfoList 
        me={profile} 
        isEditing={isInfoEditing} 
      />

      {/* 회원탈퇴 버튼 - 오른쪽 정렬 */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
          onClick={() => setIsModalOpen(true)}
        >
          회원탈퇴하기
        </Button>
      </div>

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="정말 탈퇴하시겠습니까?"
        message="탈퇴하시면 모든 데이터가 삭제되며 복구할 수 없습니다."
      />
    </div>
  );
}
