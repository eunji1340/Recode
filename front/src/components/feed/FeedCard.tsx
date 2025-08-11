import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemTitle from './ProblemTitle';
import FollowButton from '../common/FollowButton';
import HeartIcon from '../common/HeartIcon';
import CommentIcon from '../common/CommentIcon';
import TagList from '../common/TagList';
import LanguageIcon from '../common/LanguageIcon';
import UserProfile from '../user/UserImage';
import { getTimeAgo } from '../../utils/date'
import { useLike } from '../../hooks/useLike';
import { useFollow } from '../../hooks/useFollow';
import type { ExploreFeedCardData } from '../../types/feed';
import { useUserStore } from '../../stores/userStore'

/**
 * 피드 카드 단일 항목 컴포넌트 (ExplorePage용)
 * @param props - ExploreFeedCardData 타입의 피드 카드 정보
 */
const FeedCard: React.FC<ExploreFeedCardData> = (props) => {
  const currentUserId = useUserStore((state) => state.userId);
  
  const {
    noteId,
    noteTitle,
    successLanguage,
    isPublic,
    createdAt,
    viewCount,
    likeCount,
    commentCount,
    user,
    problem,
    tags,
    deleted,
    liked: isLiked,
    following: isFollowing,
  } = props;

  const {
    liked,
    likeCount: currentLikeCount,
    toggleLike,
  } = useLike(noteId, isLiked, likeCount);

  const { isFollowing: currentFollowing, toggleFollow } = useFollow(
    isFollowing,
    user.userId,
  );

  const navigate = useNavigate();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${user.userId}`);
  };

  const handleCardClick = () => {
    navigate(`/note/${props.noteId}`);
  };

  return (
    <div className="w-[330px] h-[300px] bg-white rounded-xl shadow p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition cursor-pointer text-[#0B0829]" onClick={handleCardClick}>
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

        <div className="flex items-center justify-between text-xs text-[#A0BACC]">
          <span>{getTimeAgo(createdAt)}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1"
              onClick={handleProfileClick}>
              <UserProfile
                image={user.image}
                size={20}
              />
              <span className="text-[#0B0829] font-medium">
                {user.nickname}
              </span>
            </div>
            {currentUserId !== null && user.userId !== Number(currentUserId) && (
              <FollowButton
                isFollowing={currentFollowing}
                onToggle={toggleFollow}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center font-bold text-2xl mb-2 line-clamp-2" onClick={handleCardClick}>
        {noteTitle}
      </div>

      {/* Footer */}
      <div className="text-sm space-y-2">
        <LanguageIcon language={successLanguage} />
        <div className="border-t border-zinc-200" />

        <div className="flex items-center justify-between w-full">
          <TagList tags={tags} maxWidth={230} />
          <div className="flex gap-2 text-xs items-center shrink-0 min-w-[64px]">
            <HeartIcon
              liked={liked}
              likeCount={currentLikeCount}
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
            />
            <CommentIcon count={commentCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
