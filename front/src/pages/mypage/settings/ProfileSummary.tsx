import React from 'react';
import type { UserProfile } from '../../../types/user';
import InfoRow from './InfoRow';
import Button from '../../../components/common/Button';

interface ProfileSummaryProps {
  me: UserProfile;
  isEditing?: boolean;
  onEditToggle?: () => void;
}

export default function ProfileSummary({
  me,
  isEditing,
  onEditToggle,
}: ProfileSummaryProps) {
  return (
    <section className="relative rounded-lg border border-zinc-200 bg-white p-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-zinc-800">내 프로필</h3>
        <div className='space-x-2'>
          {onEditToggle && (
            <Button variant="outline" onClick={onEditToggle}>
              {isEditing ? '취소' : '수정'}
            </Button>
          )}
          {isEditing && (
            <Button variant="filled" onClick={onEditToggle}>
              저장
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-20 w-20 flex-shrink-0">
          <img
            src={me.image ?? '/src/assets/images/profile_default.jpg'}
            alt="profile"
            className="h-full w-full rounded-full object-cover ring-2 ring-zinc-100"
          />
        </div>

        <div className="flex flex-col ml-10">
          <InfoRow
            label="닉네임"
            value={
              isEditing ? (
                <input
                  type="text"
                  defaultValue={me.nickname}
                  className="border rounded-md p-1"
                />
              ) : (
                me.nickname
              )
            }
          />
          <InfoRow label="아이디" value={me.recodeId} />
          <InfoRow
            label="한마디"
            value={
              isEditing ? (
                <input
                  type="text"
                  defaultValue={me.bio}
                  className="border rounded-md p-1"
                />
              ) : (
                me.bio
              )
            }
          />
        </div>
      </div>
    </section>
  );
}
