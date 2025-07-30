import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiMessageSquare, FiHash } from 'react-icons/fi';

interface MainFeedProps {
  noteId: number;
  noteTitle: string;
  content: string;
  successCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  failCode: string;
  failCodeStart: number;
  failCodeEnd: number;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  user: {
    userId: number;
    nickname: string;
    image?: string;
  };
  problem: {
    problemId: number;
    problemName: string;
    tier: number;
    language: string;
  };
  tags: string[];
}

const MainFeed: React.FC<MainFeedProps> = ({
  noteTitle,
  content,
  successCode,
  failCode,
  createdAt,
  likeCount,
  commentCount,
  isLiked,
  tags,
  user,
  problem,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likeCount);

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
  };

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

  const getLanguageIconUrl = (lang: string): string => {
    const exceptions: Record<string, string> = {
      'C++': 'cplusplus',
      'C#': 'csharp',
    };
    const key = exceptions[lang] ?? lang.toLowerCase();
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
  };

  const HeartIcon = liked ? FaHeart : FiHeart;

  return (
    <div className="w-full bg-white rounded-xl shadow px-5 py-4 space-y-2 text-[#0B0829]">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-extrabold leading-snug tracking-tight text-[#0B0829]">
              {noteTitle}
            </div>
          </div>
          {/* 프로필 & 닉네임 */}
          <div className="flex items-center gap-2">
            {user.image ? (
              <img
                src={user.image}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              ) : (
              <div className="w-8 h-8 rounded-full bg-[#A0BACC] flex items-center justify-center text-white font-bold">
                {user.nickname[0]}
              </div>
            )}
            <div className="text-base font-semibold">{user.nickname}</div>
          </div>
        </div>
        {/* 경과 시간 */}
        <div className="text-sm text-zinc-500">{getTimeAgo(createdAt)}</div>
      </div>

      {/* Content */}
      <div className="bg-[#F8F9FA] p-5 rounded-xl space-y-4">
        {/* 문제 정보 */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 text-sm">
            <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-[2px] rounded">
              {problem.tier}
            </span>
            <span className="font-bold">{problem.problemName}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <img
              src={getLanguageIconUrl(problem.language)}
              alt={`${problem.language} icon`}
              className="w-5 h-5"
            />
            <span className="font-mono">{problem.language}</span>
          </div>
        </div>

        {/* 코드 비교 */}
        <div className="flex flex-col md:flex-row gap-4 text-sm font-mono">
          <pre className="w-full md:w-1/2 bg-[#FDECEC] p-3 rounded-md whitespace-pre-wrap overflow-x-auto text-[#cc1f1a]">
            {failCode}
          </pre>
          <pre className="w-full md:w-1/2 bg-[#EDF4FC] p-3 rounded-md whitespace-pre-wrap overflow-x-auto text-[#1f3bcc]">
            {successCode}
          </pre>
        </div>

        {/* 노트 내용 */}
        <div className="text-sm bg-white rounded-xl p-3 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
      
      {/* 구분선 */}
      <div className="h-px bg-zinc-200" />

      {/* Footer */}
      <div className="text-sm">
        <div className="flex justify-between items-center flex-wrap gap-2">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 border border-[#A0BACC] bg-[#E6EEF4] text-[#13233D] rounded-full px-2 py-[2px] text-xs font-medium"
              >
                <FiHash className="w-[10px] h-[10px]" />
                {tag}
              </span>
            ))}
          </div>

          {/* Like / Comment */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-rose-500">
              <button onClick={handleLikeClick}>
                <HeartIcon className="w-4 h-4" />
              </button>
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-[#13233D]">
              <FiMessageSquare className="w-4 h-4" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeed;
