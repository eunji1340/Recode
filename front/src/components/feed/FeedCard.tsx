import React, { useState } from "react";
import FeedCardHeader from "./FeedCardHeader";
import FeedCardContent from "./FeedCardContent";
import FeedCardFooter from "./FeedCardFooter";

interface FeedCardProps {
  level: number;
  title: string;
  content: string;
  timeAgo: string;
  nickname: string;
  language: string;
  tags: string[];
  likes: number;
  comments: number;
  liked: boolean;
}

const FeedCard: React.FC<FeedCardProps> = ({
  level,
  title,
  content,
  timeAgo,
  nickname,
  language,
  tags,
  likes: initialLikes,
  comments,
  liked: initiallyLiked,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [liked, setLiked] = useState(initiallyLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev);
    // TODO: 서버 요청 추가 가능
  };

  const handleLikeClick = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => prev + (liked ? -1 : 1));
    // TODO: 서버 요청 추가 가능
  };

  return (
    <div className="w-[320px] h-[300px] bg-white rounded-xl shadow p-6 overflow-hidden flex flex-col justify-between hover:shadow-md transition cursor-pointer">
      <FeedCardHeader
        level={level}
        title={title}
        timeAgo={timeAgo}
        nickname={nickname}
        isFollowing={isFollowing}
        onFollowToggle={handleFollowToggle}
      />
      <FeedCardContent content={content} />
      <FeedCardFooter
        language={language}
        tags={tags}
        likes={likes}
        comments={comments}
        liked={liked}
        onLikeClick={handleLikeClick}
      />
    </div>
  );
};

export default FeedCard;