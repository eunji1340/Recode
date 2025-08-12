import React from 'react';
import HeartIcon from '../common/HeartIcon';
import CommentIcon from '../common/CommentIcon';
import Tag from '../common/Tag';

interface MainFeedFooterProps {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  tags: string[];
  onLikeClick: () => void;
}

/**
 * MainFeedFooter - 좋아요, 댓글, 태그를 한 줄로 표시하는 하단 컴포넌트
 */
const MainFeedFooter: React.FC<MainFeedFooterProps> = ({
  liked,
  likeCount,
  commentCount,
  tags,
  onLikeClick,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2 text-sm">
      {/* 태그 리스트 */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((tag) => (
          <Tag key={tag} tagName={tag} />
        ))}
      </div>

      {/* 좋아요 / 댓글 */}
      <div className="flex items-center gap-4">
        <HeartIcon liked={liked} likeCount={likeCount} onClick={onLikeClick} />
        <CommentIcon count={commentCount} />
      </div>
    </div>
  );
};

export default MainFeedFooter;
