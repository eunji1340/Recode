import React from 'react';
import { Heart, MessageCircle, Hash } from 'lucide-react';

interface FeedCardFooterProps {
  language: string;
  tags: string[];
  likes: number;
  comments: number;
}

const FeedCardFooter: React.FC<FeedCardFooterProps> = ({
  language,
  tags,
  likes,
  comments,
}) => {
  const iconMap: Record<string, string> = {
    Python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    JavaScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    TypeScript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    Java: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    Cpp: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  };

  const iconUrl = iconMap[language] ?? '';
  const visibleTags = tags.slice(0, 3);
  const hasMoreTags = tags.length > 3;

  return (
    <div className="text-sm text-[#0B0829] space-y-2">
      {/* 언어 */}
      <div className="flex items-center gap-2 text-sm">
        {iconUrl && (
          <img src={iconUrl} alt={`${language} icon`} className="w-5 h-5" />
        )}
        <span>{language}</span>
      </div>

      {/* 줄 */}
      <div className="border-t border-zinc-200" />

      {/* 태그 + 좋아요 */}
      <div className="flex items-center justify-between w-full">
        {/* 태그 */}
        <div className="flex items-center gap-2 overflow-hidden max-w-[200px]">
          {visibleTags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-[2px] border border-[#A0BACC] bg-[#E6EEF4] text-[#13233D] rounded-full px-2 py-[2px] text-[10px] font-medium flex-shrink-0"
            >
              <Hash className="w-[10px] h-[10px] -ml-[1px]" />
              {tag}
            </span>
          ))}
          {hasMoreTags && (
            <span className="text-[10px] text-zinc-400 font-medium">+{tags.length - 3}</span>
          )}
        </div>

        {/* 반응 */}
        <div className="flex gap-[6px] text-zinc-500 text-xs items-center shrink-0 min-w-[64px]">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCardFooter;
