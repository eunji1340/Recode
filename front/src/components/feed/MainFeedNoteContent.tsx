import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MainFeedNoteContentProps {
  content: string;
}

/**
 * MainFeedNoteContent - 마크다운 형식의 노트 본문 렌더링
 * - GFM 지원 (테이블, 체크박스, strikethrough 등)
 * - 기존 UI 유지 + 문단 간격 최소화
 */
const MainFeedNoteContent: React.FC<MainFeedNoteContentProps> = ({ content }) => {
  return (
    <div className="prose bg-white rounded-xl leading-relaxed text-sm max-w-none p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
};

export default MainFeedNoteContent;
