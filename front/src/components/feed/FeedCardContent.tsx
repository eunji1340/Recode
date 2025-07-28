import React from 'react';

interface FeedCardContentProps {
  content: string;
}

const FeedCardContent: React.FC<FeedCardContentProps> = ({ content }) => {
  return (
    <div className="text-center font-bold text-2xl mb-2 line-clamp-2">
        {content}
    </div>
  );
};

export default FeedCardContent;
