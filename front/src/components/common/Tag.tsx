// src/components/feed/Tag.tsx

import { FiHash } from 'react-icons/fi';

export interface TagProps {
  tagName: string;
}

/**
 * @param tagName - 태그 이름
 */
export default function Tag({ tagName }: TagProps) {
  return (
    <span className="inline-flex items-center gap-[2px] border border-[#A0BACC] bg-[#E6EEF4] text-[#13233D] rounded-full px-2 py-[2px] text-xs font-medium flex-shrink-0">
      <FiHash className="w-[12px] h-[12px] -ml-[1px]" />
      {tagName}
    </span>
  );
}
