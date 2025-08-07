import React, { useEffect, useRef, useState } from 'react';
import ProblemTitle from './ProblemTitle';
import FollowButton from '../common/FollowButton';
import HeartIcon from '../common/HeartIcon';
import CommentIcon from '../common/CommentIcon';
import Tag from '../common/Tag';
import UserProfile from '../user/UserProfile';

import { useLike } from '../../hooks/useLike';
import { useFollow } from '../../hooks/useFollow';
import type { ExploreFeedCardData } from '../../types/feed';

interface FeedCardProps extends ExploreFeedCardData {}

/**
 * 피드 카드 단일 항목 컴포넌트 (ExplorePage용)
 */
const FeedCard: React.FC<FeedCardProps> = ({
  noteId,
  isLiked,
  likeCount,
  isFollowing,
  noteTitle,
  createdAt,
  user,
  problem,
  tags,
  commentCount,
}) => {
  const {
    liked,
    likeCount: currentLikeCount,
    toggleLike,
  } = useLike(noteId, isLiked, likeCount);

  const { isFollowing: currentFollowing, toggleFollow } = useFollow(
    isFollowing,
    user.userId,
  );

  const tagContainerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tags.length);

  useEffect(() => {
    const updateVisibleTags = () => {
      const container = tagContainerRef.current;
      if (!container) return;

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
      plusTag.innerText = `+${tags.length - 1}`;
      document.body.appendChild(plusTag);
      const plusWidth = plusTag.offsetWidth + 4;
      document.body.removeChild(plusTag);

      let total = 0;
      let showCount = 0;
      const max = container.offsetWidth;

      for (let i = 0; i < tagWidths.length; i++) {
        const nextWidth = total + tagWidths[i];
        const remaining = tagWidths.length - (i + 1);
        const needPlus = remaining > 0;
        if (needPlus && nextWidth + plusWidth > max) break;
        if (!needPlus && nextWidth > max) break;

        total = nextWidth;
        showCount++;
      }

      setVisibleCount(showCount);
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

  const getLanguageIconUrl = (lang?: string): string | null => {
    if (!lang) return null;
    const exceptions: Record<string, string> = {
      'C++': 'cplusplus',
      'C#': 'csharp',
    };
    const key = exceptions[lang] ?? lang.toLowerCase();
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
  };

  const languageIconUrl = getLanguageIconUrl(problem.problemLanguage);

  return (
    <div className="w-[360px] h-[330px] bg-white rounded-xl shadow p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition cursor-pointer text-[#0B0829]">
      {/* Header */}
      <div className="w-full">
        <ProblemTitle
          problemId={problem.problemId}
          problemName={problem.problemName}
          problemTier={problem.problemTier}
          size={20}
          fontSize="text-base"
        />
        <div className="my-2 h-px bg-zinc-200" />

        {/* 작성자 + 팔로우 */}
        <div className="flex items-center justify-between text-xs text-[#A0BACC]">
          <span>{getTimeAgo(createdAt)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <UserProfile
                nickname={user.nickname}
                image={user.image}
                size={20}
              />
              <span className="text-[#0B0829] font-medium">
                {user.nickname}
              </span>
            </div>
            <FollowButton
              isFollowing={currentFollowing}
              onToggle={toggleFollow}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center font-bold text-2xl mb-2 line-clamp-2">
        {noteTitle}
      </div>

      {/* Footer */}
      <div className="text-sm space-y-2">
        {languageIconUrl && (
          <div className="flex items-center gap-1 text-sm">
            <img
              src={languageIconUrl}
              alt={`${problem.problemLanguage} icon`}
              className="w-5 h-5"
            />
            <span className="text-xs">{problem.problemLanguage}</span>
          </div>
        )}
        <div className="border-t border-zinc-200" />

        <div className="flex items-center justify-between w-full">
          {/* 태그 */}
          <div
            ref={tagContainerRef}
            className="flex items-center gap-1 overflow-hidden max-w-[230px]"
          >
            {tags.slice(0, visibleCount).map((tag, idx) => (
              <Tag key={idx} tagName={tag} />
            ))}
            {visibleCount < tags.length && (
              <span className="text-[10px] text-zinc-400 font-medium whitespace-nowrap">
                +{tags.length - visibleCount}
              </span>
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

export default FeedCard;
