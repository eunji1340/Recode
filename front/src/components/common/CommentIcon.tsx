// src/components/feed/CommentIcon.tsx

import { FiMessageSquare } from 'react-icons/fi';

interface CommentIconProps {
  count: number;
  onClick?: () => void;
}

/**
 * 댓글 아이콘 + 개수
 *
 * @param count - 댓글 수
 * @param onClick - 클릭 시 실행할 콜백 (optional)
 */
export default function CommentIcon({ count, onClick }: CommentIconProps) {
  return (
    <div
      className="flex items-center gap-1 text-[#13233D] cursor-pointer"
      onClick={onClick}
    >
      <FiMessageSquare className="w-5 h-5" />
      <span>{count}</span>
    </div>
  );
}
