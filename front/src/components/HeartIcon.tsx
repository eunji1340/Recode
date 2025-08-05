import { FaHeart } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';

interface HeartIconButtonProps {
  liked: boolean;
  likes: number;
  onClick: () => void;
}

/**
 * @param liked - user별 좋아요 클릭 여부
 * @param likes - 전체 좋아요 갯수
 * @callback - 클릭시 콜백함수
 */
export default function HeartIcon({
  liked,
  likes,
  onClick,
}: HeartIconButtonProps) {
  const Icon = liked ? FaHeart : FiHeart;
  return (
    <div className="flex items-center gap-1 text-rose-500">
      <button onClick={onClick}>
        <Icon className="w-4 h-4" />
      </button>
      <span>{likes}</span>
    </div>
  );
}
