import { useState } from 'react';

export default function FollowBtn() {
  const [isFollowing, setIsFollowing] = useState(false);
  return (
    <div>
      <button
        // onClick={handleFollowToggle}
        className={`px-2 py-[2px] text-xs font-medium rounded-full transition-colors border
                ${
                  isFollowing
                    ? 'text-white border-[--primary] bg-[--primary]'
                    : 'text-[#13233D] border-[#13233D] hover:bg-[#F0F2F5]'
                }`}
      >
        {isFollowing ? '팔로잉' : '팔로우'}
      </button>
    </div>
  );
}
