import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MainFeedNoteContentProps {
  content: string;
}

/**
 * MainFeedNoteContent - 마크다운 형식의 노트 본문 렌더링
 * - GFM 지원 (테이블, 체크박스, strikethrough 등)
 */
const MainFeedNoteContent: React.FC<MainFeedNoteContentProps> = ({ content }) => {
  return (
    <div className="prose max-w-none bg-white rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default MainFeedNoteContent;
