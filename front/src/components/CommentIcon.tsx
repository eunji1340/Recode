import { FiMessageSquare } from 'react-icons/fi';

interface CommentIconDisplayProps {
  commentCount: number;
}

export default function CommentIcon({ commentCount }: CommentIconDisplayProps) {
  return (
    <div className="flex items-center gap-1 text-[#13233D]">
      <FiMessageSquare className="w-4 h-4" />
      <span>{commentCount}</span>
    </div>
  );
}
