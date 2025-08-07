import React from 'react';

interface UserProfileProps {
  nickname: string;
  image?: string;
  size?: number; // 기본 크기(px)
}

/**
 * 사용자 프로필 이미지 또는 닉네임 이니셜
 *
 * @param nickname - 유저 닉네임
 * @param image - 유저 프로필 이미지 (옵션)
 * @param size - 아이콘 크기 (px), 기본 20
 */
export default function UserProfile({
  nickname,
  image,
  size = 20,
}: UserProfileProps) {
  const fontSize = Math.floor(size / 2);

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${fontSize}px`,
  };

  return image ? (
    <img
      src={image}
      alt="profile"
      className="rounded-full object-cover"
      style={style}
    />
  ) : (
    <div
      className="rounded-full bg-[#A0BACC] flex items-center justify-center text-white font-bold"
      style={style}
    >
      {nickname[0]}
    </div>
  );
}
