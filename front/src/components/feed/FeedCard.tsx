import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";      
import { FiHeart, FiMessageSquare, FiHash } from "react-icons/fi";

interface FeedCardProps {
  level: number;
  title: string;
  content: string;
  timeAgo: string;
  nickname: string;
  language: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({
  level,
  title,
  content,
  timeAgo,
  nickname,
  language,
  tags,
  likes: initialLikes,
  comments,
  liked: initiallyLiked,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(initiallyLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    // TODO: 서버 요청 추가 가능
  };

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
    // TODO: 서버 요청 추가 가능
  };

  const getLanguageIconUrl = (lang: string): string => {
    const exceptions: Record<string, string> = {
      "C++": "cplusplus",
      "C#": "csharp",
    };
    const key = exceptions[lang] ?? lang.toLowerCase();
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
  };

  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - visibleTags.length;
  const HeartIcon = liked ? FaHeart : FiHeart;

  return (
    <div className="w-[320px] h-[300px] bg-white rounded-xl shadow p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition cursor-pointer text-[#0B0829]">
      {/* Header */}
      <div className="w-full">
        {/* 레벨 + 제목 */}
        <div className="flex items-center gap-2">
          <div className="bg-[#FFD600] text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            {level}
          </div>
          <span className="font-semibold text-sm">{title}</span>
        </div>

        {/* 구분선 */}
        <div className="my-2 h-px bg-zinc-200" />

        {/* 시간 + 닉네임 + 팔로우 */}
        <div className="flex items-center justify-between text-xs text-[#A0BACC]">
          <span>{timeAgo}</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-[#A0BACC] flex items-center justify-center text-white text-[10px] font-bold">
                {nickname[0]}
              </div>
              <span className="text-[#0B0829] font-medium">{nickname}</span>
            </div>
            <button
              onClick={handleFollowToggle}
              className={`px-2 py-[2px] text-xs font-medium rounded-full transition-colors border
                ${isFollowing
                  ? "text-white border-[#13233D] bg-[#13233D]"
                  : "text-[#13233D] border-[#13233D] hover:bg-[#F0F2F5]"
                }`}
            >
              {isFollowing ? "팔로잉" : "팔로우"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center font-bold text-2xl mb-2 line-clamp-2">
        {content}
      </div>

      {/* Footer */}
      <div className="text-sm space-y-2">
        <div className="flex items-center gap-1 text-sm">
          <img src={getLanguageIconUrl(language)} alt={`${language} icon`} className="w-5 h-5" />
          <span className="text-xs">{language}</span>
        </div>
        <div className="border-t border-zinc-200" />
        <div className="flex items-center justify-between w-full">
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
          <div className="flex gap-[6px] text-xs items-center shrink-0 min-w-[64px]">
            <div className="flex items-center gap-1">
              <button
                onClick={handleLikeClick}
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
    </div>
  );
};

export default FeedCard;
