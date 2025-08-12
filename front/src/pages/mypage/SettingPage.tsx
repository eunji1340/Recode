import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileSummary from '../mypage/settings/ProfileSummary';
import BasicInfoList from '../mypage/settings/BasicInfoList';
import Button from '../../components/common/Button';
import { fetchMyInfo, deleteUser, updatePassword, updateEmail } from '../../api/user';
import type { UserProfile } from '../../types/user';
import { useUserStore } from '../../stores/userStore';
import ConfirmModal from '../../components/common/ConfirmModal';
import PasswordModal from './settings/PasswordModal';

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userId, clearToken } = useUserStore();
  const navigate = useNavigate();

  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  
  // 비밀번호 변경 상태
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  /**
   * 사용자 정보 로드
   */
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
      setEmailValue(myInfo.email);
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

  /**
   * 회원탈퇴
   */
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

  /**
   * 이메일 변경 핸들러
   */
  const handleEmailSave = async () => {
    if (!userId || !emailValue) return;
    try {
      // TODO: 여기서 중복 검사 로직을 추가할 수 있습니다.
      await updateEmail(Number(userId), emailValue);
      alert('이메일이 성공적으로 변경되었습니다.');
      // 이메일 변경 후 프로필 상태 업데이트
      setProfile(prev => prev ? { ...prev, email: emailValue } : null);
      setIsProfileEditing(false); // 변경 후 수정 모드 종료
    } catch (err) {
      alert('이메일 변경에 실패했습니다.');
    }
  };

  /**
   * 자식 컴포넌트에서 프로필 업데이트를 요청할 때 호출되는 함수
   * @param updatedFields 변경된 프로필 필드 (예: { nickname: '새닉네임', bio: '새로운 한마디' })
   */
  const handleProfileUpdate = (updatedFields: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...updatedFields } : null);
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
        onEditToggle={() => {
          setIsProfileEditing(!isProfileEditing);
          if (isProfileEditing) {
            setEmailValue(profile.email);
          }
        }}
        onProfileUpdate={handleProfileUpdate} // 새로 추가된 프로필 업데이트 핸들러를 전달
      />

      {/* 기본 정보 */}
      <BasicInfoList
        me={profile}
        isEditing={isProfileEditing}
        onPasswordChangeClick={() => setIsPasswordModalOpen(true)}
        onEmailValue={emailValue}
        onEmailChange={(e) => setEmailValue(e.target.value)}
        onEmailSave={handleEmailSave}
      />

      {/* 비밀번호 변경 모달 */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={(curr, next) => updatePassword(Number(userId), curr, next)}
      />

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
