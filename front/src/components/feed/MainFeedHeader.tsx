import React from 'react';
import { getTimeAgo } from '../../utils/date';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MainFeedHeaderProps {
  noteTitle: string;
  nickname: string;
  image?: string;
  createdAt: string;
  onProfileClick?: () => void;
}

/**
 * MainFeedHeader - 메인피드 상단 정보
 * - 노트 제목, 사용자 정보, 작성 시간
 */
const MainFeedHeader: React.FC<MainFeedHeaderProps> = ({
  noteTitle,
  nickname,
  image,
  createdAt,
  onProfileClick,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-extrabold leading-snug tracking-tight text-[#0B0829]">
            {noteTitle}
          </div>
        </div>
        <div className="flex items-center gap-2"
          onClick={(e) => {
            e.stopPropagation(); // 카드 클릭 이벤트 방지
            onProfileClick?.();
          }}>
          {/* 프로필 이미지 */}
          <div className="h-8 w-8 flex-shrink-0">
            {image && image !== "null" && image !== "" ? (
              <img
                src={image}
                alt="profile"
                className="h-full w-full rounded-full object-cover ring-2 ring-zinc-100"
              />
            ) : (
              <div className="h-8 w-8 border-2 border-[#13233D] rounded-full flex items-center justify-center text-[#13233D]">
                <User className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="text-base font-semibold">{nickname}</div>
        </div>
      </div>
      <div className="text-sm text-zinc-500">{getTimeAgo(createdAt)}</div>
    </div>
  );
};

export default MainFeedHeader;
