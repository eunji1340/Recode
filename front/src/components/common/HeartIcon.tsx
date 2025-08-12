import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import type { MouseEvent } from 'react';

interface HeartIconButtonProps {
  liked: boolean;
  likeCount: number;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

/**
 * 좋아요 하트를 표시하는 버튼 컴포넌트
 *
 * @component
 * @param {boolean} liked - 현재 유저가 좋아요를 눌렀는지 여부
 * @param {number} likeCount - 현재 좋아요 수
 * @param {(e: MouseEvent<HTMLButtonElement>) => void} onClick - 버튼 클릭 시 호출될 핸들러
 */
export default function HeartIcon({
  liked,
  likeCount,
  onClick,
}: HeartIconButtonProps) {
  const Icon = liked ? FaHeart : FiHeart;

  return (
    <div className="flex items-center gap-1 text-rose-500">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        aria-label="좋아요 버튼"
        className="focus:outline-none"
      >
        <Icon className="w-5 h-5" />
      </button>
      <span>{likeCount}</span>
    </div>
  );
}
