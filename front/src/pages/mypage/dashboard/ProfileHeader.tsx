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
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <UserProfile image={image} size={80} />
        <img
          src={tierImageMap[userTier]}
          alt={`티어 ${userTier}`}
          className="w-5 h-6"
        />
        <div>
          <div className="flex items-baseline space-x-2">
            <h2 className="text-2xl font-bold">{nickname}</h2>
            <span className="text-sm text-gray-600">({bojId})</span>
            {/* 팔로우 버튼: 타인 페이지에서만 */}
            {showFollowButton && (
              <FollowButton
                following={isFollowing!}
                onToggle={onToggleFollow!}
              />
            )}
          </div>
          <p className="mt-1 text-gray-700">{bio}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div
          className="text-center cursor-pointer"
          onClick={() => onOpenModal('followers')}
        >
          <p>팔로워</p>
          <p className="text-xl font-semibold">{followerCount}</p>
        </div>
        <div
          className="text-center cursor-pointer"
          onClick={() => onOpenModal('followings')}
        >
          <p>팔로잉</p>
          <p className="text-xl font-semibold">{followingCount}</p>
        </div>
      </div>
    </div>
  );
}
