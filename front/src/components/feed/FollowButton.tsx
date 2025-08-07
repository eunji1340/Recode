import React from 'react';

interface FollowButtonProps {
  isFollowing: boolean;
  onToggle: () => void;
}

/**
 * 팔로우 버튼 컴포넌트
 *
 * @param isFollowing - 현재 팔로우 상태
 * @param onToggle - 버튼 클릭 시 호출될 핸들러
 */
const FollowButton: React.FC<FollowButtonProps> = ({ isFollowing, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`px-2 py-[2px] text-xs font-medium rounded-full transition-colors border
        ${
          isFollowing
            ? 'text-white border-[#13233D] bg-[#13233D]'
            : 'text-[#13233D] border-[#13233D] hover:bg-[#F0F2F5]'
        }`}
    >
      {isFollowing ? '팔로잉' : '팔로우'}
    </button>
  );
};

export default FollowButton;
