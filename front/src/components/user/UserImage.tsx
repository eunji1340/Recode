import React from 'react';
import { User } from 'lucide-react';
import clsx from 'clsx'; // Tailwind CSS 클래스를 조건부로 사용하기 위해 추가

interface UserImageProps {
  image?: string;
  size?: number; // 기본 크기(px)
}

/**
 * 사용자 프로필 이미지 컴포넌트입니다.
 * image prop이 있으면 이미지를, 없으면 기본 아이콘을 표시합니다.
 * @param image - 유저 프로필 이미지 URL (옵션)
 * @param size - 아이콘 및 이미지 크기 (px), 기본값은 20
 */
export default function UserImage({
  image,
  size = 20,
}: UserImageProps) {

  // image prop이 존재하고 "null" 문자열이 아닐 경우에만 img 태그 렌더링
  const shouldRenderImage = image && image !== "null";

  // 이미지 또는 대체 아이콘의 스타일
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return shouldRenderImage ? (
    <img
      src={image}
      alt="profile"
      className="rounded-full object-cover"
      style={style}
    />
  ) : (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center text-white bg-gray-400',
        'border border-gray-400'
      )}
      style={style}
    >
      <User size={size * 0.7} />
    </div>
  );
}
