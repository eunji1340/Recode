import { useState } from 'react';

export default function FollowBtn() {
  // TODO: user 상태 맞게 업데이트- API 아직 안 닮
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleFollowToggle = () => setIsFollowing((status) => !status);

  const handleMouseEnter = () => {
    if (isFollowing) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    // isHovering을 항상 false로 설정하여 마우스가 떠났을 때 상태를 되돌립니다.
    setIsHovering(false);
  };

  return (
    <button
      onClick={handleFollowToggle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`px-4 py-1 text-sm font-semibold rounded-full transition-all duration-300 ease-in-out border
        ${
          isFollowing
            ? isHovering
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-gray-200 text-gray-800 border-gray-200'
            : 'bg-transparent text-primary border-primary hover:bg-primary hover:text-white'
        }`}
    >
      {isFollowing ? (isHovering ? '언팔로우' : '팔로잉') : '팔로우'}
    </button>
  );
}
