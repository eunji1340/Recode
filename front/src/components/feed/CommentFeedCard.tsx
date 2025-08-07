import React, { useEffect, useRef, useState } from 'react';
import ProblemTitle from './ProblemTitle';
import HeartIcon from '../common/HeartIcon';
import CommentIcon from '../common/CommentIcon';
import Tag from '../common/Tag';
import UserProfile from '../user/UserProfile';

import { useLike } from '../../hooks/useLike';
import type { ExploreFeedCardData } from '../../types/feed';

interface CommentFeedCardProps extends ExploreFeedCardData {
  comment: string;
}

const CommentFeedCard: React.FC<CommentFeedCardProps> = ({
  noteId,
  isLiked,
  likeCount,
  noteTitle,
  createdAt,
  user,
  successLanguage,
  problem,
  tags,
  commentCount,
  comment,
}) => {
  const {
    liked,
    likeCount: currentLikeCount,
    toggleLike,
  } = useLike(noteId, isLiked, likeCount);

  const tagContainerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useEffect(() => {
    const updateVisibleTags = () => {
      const container = tagContainerRef.current;
      if (!container) return;

      if (tags.length === 0) {
        setVisibleCount(0);
        return;
      }

      const tagWidths = tags.map((tag) => {
        const temp = document.createElement('span');
        temp.style.visibility = 'hidden';
        temp.style.position = 'absolute';
        temp.className =
          'inline-flex items-center gap-[2px] border border-[#A0BACC] bg-[#E6EEF4] text-[#13233D] rounded-full px-2 py-[2px] text-xs font-medium flex-shrink-0';
        temp.innerText = `# ${tag}`;
        document.body.appendChild(temp);
        const width = temp.offsetWidth + 4;
        document.body.removeChild(temp);
        return width;
      });

      const plusTag = document.createElement('span');
      plusTag.style.visibility = 'hidden';
      plusTag.style.position = 'absolute';
      plusTag.className =
        'text-[10px] text-zinc-400 font-medium whitespace-nowrap';
      plusTag.innerText = '+99'; // dummy
      document.body.appendChild(plusTag);
      const plusWidth = plusTag.offsetWidth + 4;
      document.body.removeChild(plusTag);

      const max = container.offsetWidth;
      let total = 0;
      let showCount = 0;

      for (let i = 0; i < tagWidths.length; i++) {
        const nextWidth = total + tagWidths[i];
        const remaining = tagWidths.length - (i + 1);
        const needPlus = remaining > 0;

        if (needPlus && nextWidth + plusWidth > max) break;
        if (!needPlus && nextWidth > max) break;

        total = nextWidth;
        showCount++;
      }

      setVisibleCount(Math.max(1, showCount));
    };

    updateVisibleTags();
    window.addEventListener('resize', updateVisibleTags);
    return () => window.removeEventListener('resize', updateVisibleTags);
  }, [tags]);

  const getTimeAgo = (dateStr: string): string => {
    const now = new Date();
    const created = new Date(dateStr);
    const diffMin = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60),
    );
    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}시간 전`;
    return `${Math.floor(diffHr / 24)}일 전`;
  };

  return (
    <div className="w-[330px] h-[300px] bg-white rounded-xl shadow p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition cursor-pointer text-[#0B0829]">
      {/* 헤더 */}
      <div className="w-full">
        <ProblemTitle
          problemId={problem.problemId}
          problemName={problem.problemName}
          problemTier={problem.problemTier}
          size={12}
          fontSize="text-xs"
        />
        <div className="flex items-center justify-between text-xs">
          <div className="text-base font-semibold mt-1">{noteTitle}</div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mt-2">
            <UserProfile
              nickname={user.nickname}
              image={user.image}
              size={20}
            />
          </div>
        </div>
        <div className="my-2 h-px bg-zinc-200" />
      </div>

      {/* 본문 */}
      <div className="text-center  text-xl mb-2 line-clamp-2">{comment}</div>

      {/* Footer */}
      <div className="text-sm space-y-2">
        <div className="border-t border-zinc-200" />
        <div className="flex items-center justify-between w-full">
          {/* 태그 */}
          <div
            ref={tagContainerRef}
            className="flex items-center gap-1 overflow-hidden max-w-[230px]"
          >
            {tags.length > 0 && (
              <>
                {tags.slice(0, visibleCount).map((tag, idx) => (
                  <Tag key={idx} tagName={tag} />
                ))}
                {visibleCount < tags.length && (
                  <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
                    +{tags.length - visibleCount}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2 text-xs items-center shrink-0 min-w-[64px]">
            <HeartIcon
              liked={liked}
              likeCount={currentLikeCount}
              onClick={toggleLike}
            />
            <CommentIcon count={commentCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentFeedCard;
