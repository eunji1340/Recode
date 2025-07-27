import React from 'react';
import { UserPlus2 } from 'lucide-react';

interface FeedCardHeaderProps {
  level: number;
  title: string;
  timeAgo: string;
  nickname: string;
  // isFollowing?: boolean; // 팔로잉 상태를 props로 받을 경우
}

const FeedCardHeader: React.FC<FeedCardHeaderProps> = ({
  level,
  title,
  timeAgo,
  nickname,
  // isFollowing = false,
}) => {
  return (
    <div className="w-full text-[#0B0829]">
      {/* 🟧 첫 줄: 레벨 + 제목 */}
      <div className="flex items-center gap-2">
        <div className="bg-[#FF8400] text-white text-xs font-bold px-2 py-1 rounded-md shadow">
          {level}
        </div>
        <span className="font-semibold text-sm">{title}</span>
      </div>

      {/* 🔸 회색 구분선 */}
      <div className="my-2 h-px bg-[#E0E0E0]"></div>

      {/* ⏱️ 시간 + 👤 닉네임 + 팔로우 버튼 */}
      <div className="flex items-center justify-between text-xs text-[#A0BACC]">
        <span>{timeAgo}</span>

        <div className="flex items-center gap-2">
          {/* 아바타 */}
          <div className="w-5 h-5 rounded-full bg-[#A0BACC] flex items-center justify-center text-white text-[10px] font-bold">
            {nickname[0]}
          </div>

          {/* 닉네임 */}
          <span className="font-medium">{nickname}</span>

          {/* 팔로우 버튼 */}
          <button className="p-1 rounded-full hover:bg-zinc-100 transition">
            <UserPlus2 className="w-4 h-4 text-[#2F3E53]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedCardHeader;
