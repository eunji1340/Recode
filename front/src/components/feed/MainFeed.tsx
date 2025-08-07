import React, { useState } from 'react';
import MainFeedHeader from './MainFeedHeader';
import MainFeedProblemInfo from './MainFeedProblemInfo';
import MainFeedCodeBlock from './MainFeedCodeBlock';
import MainFeedNoteContent from './MainFeedNoteContent';
import MainFeedFooter from './MainFeedFooter';
import { useLike } from '../../hooks/useLike';
import type { MainFeedData } from '@/types/feed';

const MainFeedCard: React.FC<MainFeedData> = ({
  noteId,
  noteTitle,
  content,
  successCode,
  successCodeStart,
  successCodeEnd,
  failCode,
  failCodeStart,
  failCodeEnd,
  createdAt,
  likeCount,
  commentCount,
  isLiked,
  user,
  problem,
  tags,
}) => {
  const { liked, likeCount: currentLikeCount, toggleLike } = useLike(
    noteId,
    isLiked,
    likeCount
  );

  return (
    <div className="w-full bg-white rounded-xl shadow px-5 py-4 space-y-2 text-[#0B0829]">
      {/* Header */}
      <MainFeedHeader
        noteTitle={noteTitle}
        nickname={user.nickname}
        image={user.image}
        createdAt={createdAt}
      />

      {/* Content */}
      <div className="bg-[#F8F9FA] p-5 rounded-xl space-y-4">
        {/* 문제 정보 */}
        <MainFeedProblemInfo
          problemId={problem.problemId}
          problemName={problem.problemName}
          problemTier={problem.problemTier}
          problemLanguage={problem.problemLanguage}
        />

        {/* 코드 비교 */}
        <MainFeedCodeBlock
          successCode={successCode}
          failCode={failCode}
          successCodeStart={successCodeStart}
          successCodeEnd={successCodeEnd}
          failCodeStart={failCodeStart}
          failCodeEnd={failCodeEnd}
          problemLanguage={problem.problemLanguage}
        />

        {/* 노트 내용 */}
        <MainFeedNoteContent content={content} />
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-200" />

      {/* Footer */}
      <MainFeedFooter
        liked={liked}
        likeCount={currentLikeCount}
        commentCount={commentCount}
        tags={tags}
        onLikeClick={toggleLike}
      />
    </div>
  );
};

export default MainFeedCard;
