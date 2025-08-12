import { useState } from 'react';
import { addLike, removeLike } from '../api/feed';

/**
 * 좋아요 상태를 관리하는 훅
 */
export function useLike(
  noteId: number,
  initialLiked: boolean,
  initialCount: number
) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  /**
   * 좋아요 상태 토글
   */
  const toggleLike = async () => {
    try {
      if (liked) {
        await removeLike(noteId); // ✅ likeId 없이 noteId만 넘김
        setLikeCount((prev) => prev - 1);
      } else {
        await addLike(noteId);
        setLikeCount((prev) => prev + 1);
      }
      setLiked((prev) => !prev);
    } catch (err) {
      console.error('좋아요 처리 실패:', err);
    }
  };

  return { liked, likeCount, toggleLike };
}
