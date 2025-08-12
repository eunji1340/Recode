import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemTitle from './ProblemTitle';
import HeartIcon from '../common/HeartIcon';
import CommentIcon from '../common/CommentIcon';
import TagList from '../common/TagList';
import UserProfile from '../user/UserImage';
import { useLike } from '../../hooks/useLike';
import type { CommentFeedCardData } from '../../types/feed';
import { useUserStore } from '../../stores/userStore';

/**
 * 댓글 피드 카드
 * - 노트 제목을 주제(큰 타이포)
 * - 문제 정보는 보조(작은 타이포)
 */
const CommentCard: React.FC<CommentFeedCardData> = (props) => {
  const currentUserId = useUserStore((s) => s.userId);

  const {
    noteId,
    noteTitle,
    commentWriter, // 사용 시 표시 고려
    content,
    createdAt,
    viewCount,
    likeCount,
    commentCount,
    user,
    problem,
    tags,
    liked: isLiked,
  } = props;

  const { liked, likeCount: currentLikeCount, toggleLike } = useLike(
    noteId,
    isLiked,
    likeCount
  );

  const navigate = useNavigate();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${user.userId}`);
  };
  const handleCardClick = () => navigate(`/note/${noteId}`);

  return (
    <div
      className="w-[330px] h-[250px] bg-white rounded-2xl shadow p-5 overflow-hidden flex flex-col hover:shadow-md transition cursor-pointer text-[#0B0829]"
      onClick={handleCardClick}
    >
      {/* Top: 문제 정보(보조) + 작성자 */}
      <div className="flex items-center justify-between">
        <div className="shrink min-w-0">
          <ProblemTitle
            problemId={problem.problemId}
            problemName={problem.problemName}
            problemTier={problem.problemTier}
            size={16}
            fontSize="text-xs"
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-[#A0BACC]"
          onClick={handleProfileClick}>
          <UserProfile image={user.image} size={20} />
          <span className="text-[#0B0829] font-medium">{user.nickname}</span>
        </div>
      </div>

      {/* 노트 제목(주제) */}
      <h3 className="mt-2 text-lg font-semibold text-[#13233D] line-clamp-1">
        {noteTitle}
      </h3>

      <div className="mt-2 h-px bg-zinc-200" />

      {/* 본문(댓글 내용) */}
      <div className="flex-1 flex items-center justify-center px-2">
        <p className="text-lg text-zinc-700 text-center leading-7 line-clamp-4">
          {content}
        </p>
      </div>

      {/* Footer */}
      <div className="pt-2">
        <div className="border-t border-zinc-200" />
        <div className="mt-2 flex items-center justify-between">
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

export default CommentCard;
