import { useState, useEffect } from 'react';
import type { UserProfile } from '../../../types/user';
import InfoRow from './InfoRow';
import Button from '../../../components/common/Button';
import { useUserStore } from '../../../stores/userStore';
import { updateNickname, checkNicknameDuplicate, updateBio } from '../../../api/user';
import UserImage from '../../../components/user/UserImage';

interface ProfileSummaryProps {
  me: UserProfile;
  isEditing?: boolean;
  onEditToggle?: () => void;
  onProfileUpdate: (newProfile: Partial<UserProfile>) => void; // 부모에게 업데이트를 알리는 함수
}

// 길이 제한 상수
const MAX_NICKNAME_LENGTH = 15;
const MAX_BIO_LENGTH = 100;

export default function ProfileSummary({
  me,
  isEditing,
  onEditToggle,
  onProfileUpdate,
}: ProfileSummaryProps) {
  const { userId } = useUserStore();

  const [nickname, setNickname] = useState(me.nickname);
  const [bio, setBio] = useState(me.bio);
  const [isLoading, setIsLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [bioError, setBioError] = useState('');
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  // 'me' prop이 변경될 때마다 로컬 상태를 동기화
  useEffect(() => {
    setNickname(me.nickname);
    setBio(me.bio);
    setNicknameError('');
    setBioError('');
  }, [me]);

  /**
   * 닉네임 길이 및 중복 체크
   */
  const checkNickname = async (targetNickname: string) => {
    // 길이 체크
    if (targetNickname.length > MAX_NICKNAME_LENGTH) {
      setNicknameError(`닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`);
      return false;
    }

    if (!targetNickname.trim() || targetNickname === me.nickname) {
      setNicknameError('');
      return true; // 사용 가능
    }

    setIsCheckingDuplicate(true);
    try {
      const res = await checkNicknameDuplicate(targetNickname); // { data: boolean }
      const isDuplicate = res.data;

      if (isDuplicate) {
        setNicknameError('이미 사용 중인 닉네임입니다.');
        return false;
      } else {
        setNicknameError('');
        return true;
      }
    } catch (error) {
      console.error('닉네임 중복 체크 오류:', error);
      setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  /**
   * 닉네임 입력 핸들러
   */
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 길이 제한
    if (value.length <= MAX_NICKNAME_LENGTH) {
      setNickname(value);
      // 실시간으로 길이 에러 체크
      if (value.length === MAX_NICKNAME_LENGTH) {
        setNicknameError(`닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`);
      } else {
        setNicknameError('');
      }
    }
  };

  /**
   * 한마디 입력 핸들러
   */
  const handleBioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 길이 제한
    if (value.length <= MAX_BIO_LENGTH) {
      setBio(value);
      setBioError('');
    } else {
      setBioError(`한마디는 ${MAX_BIO_LENGTH}자 이하로 입력해주세요.`);
    }
  };

  /**
   * 저장
   */
  const handleSave = async () => {
    const isNicknameChanged = nickname.trim() !== me.nickname;
    const isBioChanged = bio.trim() !== me.bio;

    if (!isNicknameChanged && !isBioChanged) {
      onEditToggle?.();
      return;
    }

    // 길이 체크
    if (nickname.length > MAX_NICKNAME_LENGTH) {
      setNicknameError(`닉네임은 ${MAX_NICKNAME_LENGTH}자 이하로 입력해주세요.`);
      return;
    }

    if (bio.length > MAX_BIO_LENGTH) {
      setBioError(`한마디는 ${MAX_BIO_LENGTH}자 이하로 입력해주세요.`);
      return;
    }

    if (isNicknameChanged) {
      const isValid = await checkNickname(nickname);
      if (!isValid) return;

      if (!nickname.trim()) {
        setNicknameError('닉네임을 입력해주세요.');
        return;
      }
    }

    if (!userId) {
      alert('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedProfile: Partial<UserProfile> = {};

      if (isNicknameChanged) {
        await updateNickname(Number(userId), nickname);
        updatedProfile.nickname = nickname;
      }
      if (isBioChanged) {
        await updateBio(Number(userId), bio);
        updatedProfile.bio = bio;
      }

      // 부모 컴포넌트에게 변경 사항을 알립니다.
      onProfileUpdate(updatedProfile);
      onEditToggle?.();
    } catch (error) {
      console.error('프로필 변경 오류:', error);
      alert('프로필 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 취소
   */
  const handleCancel = () => {
    setNickname(me.nickname);
    setBio(me.bio);
    setNicknameError('');
    setBioError('');
    onEditToggle?.();
  };

  return (
    <section className="relative rounded-lg border border-zinc-200 bg-white py-6 px-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-zinc-800">내 프로필</h3>
        <div className="space-x-2">
          {onEditToggle && (
            <Button
              variant="outline"
              onClick={isEditing ? handleCancel : onEditToggle}
              disabled={isLoading}
            >
              {isEditing ? '취소' : '수정'}
            </Button>
          )}
          {isEditing && (
            <Button
              variant="filled"
              onClick={handleSave}
              disabled={isLoading || isCheckingDuplicate || !!nicknameError || !!bioError}
            >
              {isLoading ? '저장 중...' : '저장'}
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex items-center gap-6">
        {/* Profile Image */}
        <UserImage image={me.image} size={100} className="flex-shrink-0"/>

        {/* Information */}
        <div className="flex flex-col ml-10">
          <InfoRow label="아이디" value={me.recodeId} />
          <InfoRow
            label="닉네임"
            value={
              isEditing ? (
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nickname}
                      onChange={handleNicknameChange}
                      onBlur={(e) => checkNickname(e.target.value)}
                      className={`border rounded-md p-1 flex-1 ${nicknameError ? 'border-red-500' : ''}`}
                      placeholder="닉네임을 입력하세요"
                      disabled={isLoading}
                    />
                    <div className="text-xs text-gray-500">
                      {nickname.length}/{MAX_NICKNAME_LENGTH}
                    </div>
                  </div>
                  {nicknameError && (
                    <div className="text-sm text-red-500 mt-1">{nicknameError}</div>
                  )}
                </div>
              ) : (
                me.nickname
              )
            }
          />
          <InfoRow
            label="한마디"
            value={
              isEditing ? (
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={bio}
                      onChange={handleBioChange}
                      className={`border rounded-md p-1 flex-1 ${bioError ? 'border-red-500' : ''}`}
                      placeholder="한마디를 입력하세요"
                      disabled={isLoading}
                    />
                    <div className="text-xs text-gray-500">
                      {bio.length}/{MAX_BIO_LENGTH}
                    </div>
                  </div>
                  {bioError && (
                    <div className="text-sm text-red-500 mt-1">{bioError}</div>
                  )}
                </div>
              ) : (
                me.bio || '등록된 한마디가 없습니다.'
              )
            }
          />
        </div>
      </div>
    </section>
  );
}