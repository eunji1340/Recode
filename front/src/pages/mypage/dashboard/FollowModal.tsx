// src/pages/mypage/FollowModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { tierImageMap } from '../../../data/tierMap';
import FollowButton from '../../../components/common/FollowButton';

export interface FollowDetail {
  userId: number;
  bojId: string;
  nickname: string;
  userTier: number;
  isFollowing?: boolean;
  onToggleFollow?: (userId: number) => void;
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
  open,
  activeTab,
  details,
  loading,
  onClose,
  onTabChange,
}: Props) {
  
  const navigate = useNavigate()

  if (!open) return null;

  const handleClickUser = (userId: number) => {
    onClose(); // 모달 닫기
    navigate(`/user/${userId}`); // UserDetailPage로 이동
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow w-96 h-96 flex flex-col">
        {/* 탭 & 닫기 버튼 헤더 */}
        <div className="flex items-center justify-center border-b relative px-4 py-2">
          <div className="flex space-x-6">
            {(['followers', 'followings'] as const).map((tab) => (
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
          </div>
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <p>로딩 중...</p>
          ) : details.length ? (
            <ul>
              {details.map((d) => (
                <li
                  key={d.userId}
                  className="py-2 border-b last:border-b-0 flex items-center relative"
                  onClick={() => handleClickUser(d.userId)}
                >
                  {/* 좌측 티어 이미지 */}
                  <img
                    src={tierImageMap[d.userTier]}
                    alt={`티어 ${d.userTier}`}
                    className="w-5 h-6"
                  />

                  {/* 중앙에 절대 위치로 고정된 닉네임 */}
                  <span className="absolute left-1/2 transform -translate-x-1/2 font-medium">
                    {d.nickname}
                  </span>

                  {/* 우측 BOJ 아이디 */}
                  <span className="ml-auto text-sm text-gray-600">
                    ({d.bojId})
                  </span>
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
