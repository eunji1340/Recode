import React from 'react';
import type { UserProfile } from '../../../types/user';
import InfoRow from './InfoRow';
import { tierImageMap, tierMap } from '../../../data/tierMap';
import Button from '../../../components/common/Button';

interface BasicInfoListProps {
  me: UserProfile;
  isEditing?: boolean;
  onPasswordChangeClick: () => void;
  // 이메일 입력 필드에 필요한 props를 추가합니다.
  onEmailValue: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailSave: () => void;
}

export default function BasicInfoList({
  me,
  isEditing,
  onPasswordChangeClick,
  onEmailValue,
  onEmailChange,
  onEmailSave,
}: BasicInfoListProps) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white py-6 px-10">
      <h3 className="mb-4 text-lg font-semibold text-zinc-800">기본 정보</h3>
      <div className="divide-y divide-zinc-100">
        <InfoRow
          label="백준 연동"
          value={
            <div className="flex items-center gap-2">
              <img
                src={tierImageMap[me.userTier]}
                alt={tierMap[me.userTier]}
                className="h-6 w-6"
              />
              <span className="font-mono text-zinc-700">{me.bojId}</span>
            </div>
          }
        />
        <InfoRow
          label="비밀번호"
          value="••••••••"
          action={
            isEditing ? (
              <Button size="sm" variant="outline" onClick={onPasswordChangeClick}>
                변경
              </Button>
            ) : null
          }
        />
        <InfoRow
          label="이메일"
          value={
            isEditing ? (
              <input
                type="email"
                value={onEmailValue}
                onChange={onEmailChange}
                className="border rounded px-2 py-1"
              />
            ) : (
              me.email
            )
          }
          action={
            isEditing ? (
              <Button size="sm" variant="outline" onClick={onEmailSave}>
                저장
              </Button>
            ) : null
          }
        />
      </div>
    </section>
  );
}
