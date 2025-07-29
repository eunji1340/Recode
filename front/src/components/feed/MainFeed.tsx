import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FiHeart, FiMessageSquare, FiHash } from 'react-icons/fi';

interface MainFeedProps {
  note_id: number;
  user_id: number;
  problem_id: number;
  problem_name: string;
  tier: number;
  note_title: string;
  content: string;
  success_code: string;
  success_code_start: number;
  success_code_end: number;
  fail_code: string;
  fail_code_start: number;
  fail_code_end: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  tags: string[];
  nickname: string;
  profile_image?: string;
  liked: boolean;
  language?: string;
}

const MainFeed: React.FC<MainFeedProps> = ({
  problem_name,
  tier,
  nickname,
  created_at,
  note_title,
  content,
  fail_code,
  success_code,
  tags,
  language = 'Python',
  like_count: initialLikes,
  comment_count,
  liked: initiallyLiked,
}) => {
  const [liked, setLiked] = useState(initiallyLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
  };

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
    <div className="w-full bg-white rounded-xl shadow px-6 py-5 space-y-5 text-[#0B0829]">
      {/* Header */}
      <div>
        <div className="flex justify-between items-center">
          {/* 노트 제목 */}
          <div className="text-xl font-bold tracking-tight leading-snug">
            {note_title}
          </div>
          {/* 프로필 & 닉네임 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#A0BACC] flex items-center justify-center text-white font-bold">
              {nickname[0]}
            </div>
            <div className="text-base font-semibold">{nickname}</div>
          </div>
        </div>
        {/* 시간 */}
        <div className="text-xs text-zinc-500">{getTimeAgo(created_at)}</div>
      </div>

      {/* Content */}
      <div className="bg-[#F8F9FA] p-5 rounded-xl space-y-2">
        {/* 문제 정보 */}
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-[2px] rounded">
            {tier}
          </span>
          <span className="font-medium">{problem_name}</span>
        </div>

        {/* 코드 비교 */}
        <div className="flex flex-col md:flex-row gap-4 text-sm font-mono">
          <pre className="w-full md:w-1/2 bg-[#FDECEC] p-3 rounded-md whitespace-pre-wrap overflow-x-auto text-[#cc1f1a]">
            {fail_code}
          </pre>
          <pre className="w-full md:w-1/2 bg-[#EDF4FC] p-3 rounded-md whitespace-pre-wrap overflow-x-auto text-[#1f3bcc]">
            {success_code}
          </pre>
        </div>

        {/* 오답노트 내용 */}
        <div className="text-sm bg-white rounded-xl p-3">{content}</div>
      </div>

      {/* Footer */}
      <div className="text-sm space-y-2">
        {/* 언어 */}
        <div className="flex items-center gap-1 text-sm">
          <img
            src={getLanguageIconUrl(language)}
            alt={`${language} icon`}
            className="w-5 h-5"
          />
          <span>{language}</span>
        </div>

        {/* 구분선 */}
        <div className="my-2 h-px bg-zinc-200" />

        {/* Tags & 반응 */}
        <div className="flex justify-between">
          <div className="flex gap-2 flex-wrap">
            {tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 border border-[#A0BACC] bg-[#E6EEF4] text-[#13233D] rounded-full px-2 py-[2px] text-xs font-medium"
              >
                <FiHash className="w-[10px] h-[10px]" />
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-zinc-400 font-medium">
                +{tags.length - 3}
              </span>
            )}
          </div>
          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-1 text-rose-500">
              <button onClick={handleLikeClick}>
                <HeartIcon className="w-4 h-4" />
              </button>
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1 text-[#13233D]">
              <FiMessageSquare className="w-4 h-4" />
              <span>{comment_count}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainFeed;
