import React from 'react';

interface MainFeedHeaderProps {
  noteTitle: string;
  nickname: string;
  image?: string;
  createdAt: string;
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
}) => {
  const getTimeAgo = (dateStr: string): string => {
    const now = new Date();
    const created = new Date(dateStr);
    const diffMin = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}시간 전`;
    return `${Math.floor(diffHr / 24)}일 전`;
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="text-xl font-extrabold leading-snug tracking-tight text-[#0B0829]">
            {noteTitle}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {image ? (
            <img src={image} alt="profile" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#A0BACC] flex items-center justify-center text-white font-bold">
              {nickname[0]}
            </div>
          )}
          <div className="text-base font-semibold">{nickname}</div>
        </div>
      </div>
      <div className="text-sm text-zinc-500">{getTimeAgo(createdAt)}</div>
    </div>
  );
};

export default MainFeedHeader;
