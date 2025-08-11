import React from 'react';
import type { UserProfile } from '../../../types/user';
import InfoRow from './InfoRow';
import { tierImageMap, tierMap } from '../../../data/tierMap';
import Button from '../../../components/common/Button';

interface BasicInfoListProps {
  me: UserProfile;
  isEditing?: boolean;
}

export default function BasicInfoList({ me, isEditing }: BasicInfoListProps) {
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
              <Button size="sm" variant="outline">
                수정
              </Button>
            ) : null
          }
        />
        <InfoRow
          label="이메일"
          value={me.email}
          action={
            isEditing ? (
              <Button size="sm" variant="outline">
                수정
              </Button>
            ) : null
          }
        />
      </div>
    </section>
  );
}
