import React, { useEffect, useState, useCallback } from 'react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId, clearToken } = useUserStore();
  const navigate = useNavigate();

  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isInfoEditing] = useState(false); // 기본 정보 수정 여부

  /** 사용자 정보 로드 */
  const loadMyInfo = useCallback(async () => {
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
      console.error(err);
      setError('정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadMyInfo();
  }, [loadMyInfo]);

  /** 회원탈퇴 */
  const handleDelete = async () => {
    if (!userId) return;
    try {
      await deleteUser(Number(userId));
      alert('회원 탈퇴가 완료되었습니다.');
      clearToken();
      navigate('/');
    } catch (err) {
      setError('회원 탈퇴에 실패했습니다.');
    } finally {
      setIsModalOpen(false);
    }
  };

  /** 로딩 상태 */
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-slate-500">
        사용자 정보를 불러오는 중...
      </div>
    );
  }

  /** 에러 상태 */
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 font-medium">{error}</div>
          <Button onClick={() => navigate('/')}>홈으로 가기</Button>
          {error.includes('실패') && (
            <Button variant="outline" onClick={loadMyInfo}>
              다시 시도
            </Button>
          )}
        </div>
      </div>
    );
  }

  /** 정상 상태 */
  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* 프로필 */}
      <ProfileSummary
        me={profile}
        isEditing={isProfileEditing}
        onEditToggle={() => setIsProfileEditing(!isProfileEditing)}
      />

      {/* 기본 정보 */}
      <BasicInfoList me={profile} isEditing={isInfoEditing} />

      {/* 회원탈퇴 버튼 */}
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
        message={
          <>
            <p className="mb-2">
              탈퇴하시면 모든 데이터가 삭제되며 복구할 수 없습니다.
            </p>
            <p className="text-red-500 font-medium">
              이 작업은 되돌릴 수 없습니다.
            </p>
          </>
        }
      />
    </div>
  );
}