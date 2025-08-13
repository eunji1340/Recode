import React from 'react';
import { User } from 'lucide-react';
import clsx from 'clsx';

interface UserImageProps {
  image?: string;
  size?: number; // 기본 크기(px)
  className?: string; // className prop을 추가합니다.
}

/**
 * 사용자 프로필 이미지 컴포넌트입니다.
 * image prop이 있으면 이미지를, 없으면 기본 아이콘을 표시합니다.
 * @param image - 유저 프로필 이미지 URL (옵션)
 * @param size - 아이콘 및 이미지 크기 (px), 기본값은 20
 * @param className - 외부에서 전달받는 추가 CSS 클래스 (옵션)
 */
export default function UserImage({
  image,
  size = 20,
  className, // className을 props로 받습니다.
}: UserImageProps) {

  // image prop이 존재하고 "null" 문자열이 아닐 경우에만 img 태그 렌더링
  const shouldRenderImage = image && image !== "null";

  // 이미지 또는 대체 아이콘의 스타일
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center overflow-hidden',
        !shouldRenderImage && 'text-white bg-gray-400 border border-gray-400',
        className // 전달받은 className을 여기에 적용합니다.
      )}
      style={style}
    >
      {shouldRenderImage ? (
        <img
          src={image}
          alt="profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <User size={size * 0.7} />
      )}
    </div>
  );
}
