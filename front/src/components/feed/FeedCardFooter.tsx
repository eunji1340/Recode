import React from 'react';
import { FaHeart } from "react-icons/fa";      
import { FiHeart, FiMessageSquare, FiHash } from "react-icons/fi"; 

interface FeedCardFooterProps {
  language: string;
  tags: string[];
  likes: number;
  comments: number;
  liked?: boolean;
  onLikeClick?: () => void;
}

const FeedCardFooter: React.FC<FeedCardFooterProps> = ({
  language,
  tags,
  likes,
  comments,
  liked = false,
  onLikeClick,
}) => {
  const getLanguageIconUrl = (lang: string): string => {
    const exceptions: Record<string, string> = {
      "C++": "cplusplus",
      "C#": "csharp",
    };
    const key = exceptions[lang] ?? lang.toLowerCase();
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
  }

  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - visibleTags.length;
  const HeartIcon = liked ? FaHeart : FiHeart;

  return (
    <div className="text-sm text-[#0B0829] space-y-2">
      {/* 언어 */}
      <div className="flex items-center gap-1 text-sm">
        <img src={getLanguageIconUrl(language)} alt={`${language} icon`} className="w-5 h-5" />
        <span className="text-xs">{language}</span>
      </div>

      {/* 구분선 */}
      <div className="border-t border-zinc-200" />

      {/* 태그 & 반응 */}
      <div className="flex items-center justify-between w-full">
        {/* 태그 */}
        <div className="flex items-center gap-2 overflow-hidden max-w-[200px]">
          {visibleTags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-[2px] border border-[#A0BACC] bg-[#E6EEF4] text-[#13233D] rounded-full px-2 py-[2px] text-[10px] font-medium flex-shrink-0"
            >
              <FiHash className="w-[10px] h-[10px] -ml-[1px]" />
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="text-[10px] text-zinc-400 font-medium">+{extraTagCount}</span>
          )}
        </div>

        {/* 좋아요 / 댓글 */}
        <div className="flex gap-[6px] text-xs items-center shrink-0 min-w-[64px] text-[#0B0829]">
          <div className="flex items-center gap-1">
            <button
              onClick={onLikeClick}
              className="transition-colors text-rose-500"
            >
              <HeartIcon className="w-4 h-4" />
            </button>
            <span>{likes}</span>
          </div>          
          <div className="flex items-center gap-1">
            <FiMessageSquare className="w-4 h-4" />
            <span>{comments}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FeedCardFooter;
