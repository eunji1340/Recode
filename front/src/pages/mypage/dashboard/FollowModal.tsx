// src/pages/mypage/FollowModal.tsx
import React from 'react';
import { tierImageMap } from '../../../data/tierMap';

export interface FollowDetail {
  userId: number;
  bojId: string;
  nickname: string;
  userTier: number;
}

interface Props {
  open: boolean;
  activeTab: 'followers' | 'followings';
  details: FollowDetail[];
  loading: boolean;
  onClose: () => void;
  onTabChange: (tab: 'followers' | 'followings') => void;
}

export default function FollowModal({
  open, activeTab, details, loading, onClose, onTabChange,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow w-96 h-96 flex flex-col">
        {/* 탭 */}
        <div className="flex border-b relative">
          {(['followers', 'followings'] as const).map(tab => (
            <button
              key={tab}
              className={`flex-1 py-2 text-center ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 font-semibold'
                  : 'text-gray-600'
              }`}
              onClick={() => onTabChange(tab)}
            >
              {tab === 'followers' ? '팔로워' : '팔로잉'}
            </button>
          ))}
          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <p>로딩 중...</p>
          ) : details.length ? (
            <ul>
              {details.map(d => (
                <li key={d.userId} className="py-2 border-b last:border-b-0 flex justify-between">
                  <img src={tierImageMap[d.userTier]} alt={`티어 ${d.userTier}`} className="w-5 h-6" />
                  <span className="font-medium">{d.nickname}</span>
                  <span className="text-sm text-gray-600">({d.bojId})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
