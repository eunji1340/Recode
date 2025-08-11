// UserProfile.tsx
import React from 'react';
import { User } from 'lucide-react';

interface UserProfileProps {
  image?: string;
  size?: number; // 기본 크기(px)
}

/**
 * 사용자 프로필 이미지
 * @param image - 유저 프로필 이미지 (옵션)
 * @param size - 아이콘 크기 (px), 기본 20
 */
export default function UserProfile({
  image,
  size = 20,
}: UserProfileProps) {
  const fontSize = Math.floor(size / 2);

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${fontSize}px`,
  };

  // image가 존재하고 "null" 문자열이 아닐 경우에만 img 태그 렌더링
  const shouldRenderImage = image && image !== "null";

  return shouldRenderImage ? (
    <img
      src={image}
      alt="profile"
      className="rounded-full object-cover"
      style={style}
    />
  ) : (
    <User className="border-2 border-[#13233D] rounded-full flex items-center justify-center text-[#13233D]" style={style}/>
  );
}