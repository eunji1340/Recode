import { useState } from 'react';
import { addFollow, removeFollow } from '../api/feed';

/**
 * 팔로우 상태를 관리하는 커스텀 훅
 * @param initialFollowing 초기 팔로우 상태
 * @param targetUserId 팔로우 대상 유저의 ID
 */
export function useFollow(initialFollowing: boolean, targetUserId: number) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  /**
   * 팔로우 상태 토글
   */
  const toggleFollow = async (): Promise<void> => {
    try {
      if (isFollowing) {
        await removeFollow(targetUserId);
        setIsFollowing(false);
      } else {
        await addFollow(targetUserId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('팔로우 토글 실패:', error);
    }
  };

  return {
    isFollowing,
    toggleFollow,
    setIsFollowing,
  };
}
