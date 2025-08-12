import React from 'react';
import { getTimeAgo } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import UserImage from '../user/UserImage';

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
          {/* UserImage 컴포넌트 사용 */}
          <div className="h-8 w-8 flex-shrink-0">
            <UserImage
              image={image}
              size={32}
            />
          </div>

          <div className="text-base font-semibold">{nickname}</div>
        </div>
      </div>
      <div className="text-sm text-zinc-500">{getTimeAgo(createdAt)}</div>
    </div>
  );
};

export default MainFeedHeader;
