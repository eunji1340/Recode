import React from 'react';
import { tierImageMap } from '../../../data/tierMap';
import UserProfile from '../../../components/user/UserImage';
import FollowButton from '../../../components/common/FollowButton';

interface Props {
  nickname: string;
  bojId: string;
  bio: string;
  userTier: number;
  image?: string;
  followerCount: number;
  followingCount: number;
  isFollowing?: boolean; // 타인 페이지에서만 사용
  onToggleFollow?: () => void; // 타인 페이지에서만 사용
  onOpenModal: (type: 'followers' | 'followings') => void;
}

export default function ProfileHeader({
  nickname,
  bojId,
  bio,
  userTier,
  image,
  followerCount,
  followingCount,
  isFollowing,
  onToggleFollow,
  onOpenModal,
}: Props) {
  const showFollowButton =
    typeof isFollowing !== 'undefined' && typeof onToggleFollow === 'function';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center justify-between">
      {/* 왼쪽 프로필 정보 그룹 */}
      <div className="flex items-center space-x-4 mb-4 md:mb-0">
        <UserProfile image={image} size={80} />
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            {/* 닉네임과 티어를 한 줄에 배치 */}
            <h2 className="text-2xl font-bold">{nickname}</h2>
            <span className="text-sm text-gray-600">({bojId})</span>
            <img
              src={tierImageMap[userTier]}
              alt={`티어 ${userTier}`}
              className="w-5 h-6"
            />
            {/* 팔로우 버튼: 타인 페이지에서만 */}
            {showFollowButton && (
              <FollowButton
                following={isFollowing!}
                onToggle={onToggleFollow!}
              />
            )}
          </div>
          <p className="mt-1 text-gray-700 max-w-sm">{bio}</p>
        </div>
      </div>

      {/* 오른쪽 팔로워/팔로잉 정보 그룹 */}
      <div className="flex items-center space-x-6">
        <div
          className="text-center cursor-pointer transition-colors duration-200 hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => onOpenModal('followers')}
        >
          <p className="text-sm text-gray-600">팔로워</p>
          <p className="text-xl font-semibold">{followerCount}</p>
        </div>
        <div
          className="text-center cursor-pointer transition-colors duration-200 hover:bg-gray-100 p-2 rounded-lg"
          onClick={() => onOpenModal('followings')}
        >
          <p className="text-sm text-gray-600">팔로잉</p>
          <p className="text-xl font-semibold">{followingCount}</p>
        </div>
      </div>
    </div>
  );
}
