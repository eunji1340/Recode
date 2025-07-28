import React from 'react';

interface FeedCardHeaderProps {
  level: number;
  title: string;
  timeAgo: string;
  nickname: string;
  isFollowing: boolean;
  onFollowToggle?: () => void;
}

const FeedCardHeader: React.FC<FeedCardHeaderProps> = ({
  level,
  title,
  timeAgo,
  nickname,
  isFollowing,
  onFollowToggle
}) => {
  return (
    <div className="w-full text-[#0B0829]">
      {/* 레벨 + 제목 */}
      <div className="flex items-center gap-2">
        <div className="bg-[#FFD600] text-white text-xs font-bold px-2 py-1 rounded-md shadow">
          {level}
        </div>
        <span className="font-semibold text-sm">{title}</span>
      </div>

      {/* 구분선 */}
      <div className="my-2 h-px bg-zinc-200" />

      {/* 시간 + 닉네임 + 팔로우 */}
      <div className="flex items-center justify-between text-xs text-[#A0BACC]">
        <span>{timeAgo}</span>

        <div className="flex items-center gap-2">
        {/* 아바타 + 닉네임 */}
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-[#A0BACC] flex items-center justify-center text-white text-[10px] font-bold">
              {nickname[0]}
            </div>
            <span className="text-[#0B0829] font-medium">{nickname}</span>
          </div>

          {/* 팔로우 버튼 */}
          <button
            onClick={onFollowToggle}
            className={`px-2 py-[2px] text-xs font-medium rounded-full transition-colors border
              ${isFollowing
                ? "text-white border-[#13233D] bg-[#13233D]"
                : "text-[#13233D] border-[#13233D] hover:bg-[#F0F2F5]"
              }`}
          >
            {isFollowing ? "팔로잉" : "팔로우"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default FeedCardHeader;
