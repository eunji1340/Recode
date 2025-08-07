import React from 'react';
import CodePreview from '../code/CodePreview';

interface MainFeedCodeBlockProps {
  successCode: string;
  failCode: string;
  successCodeStart: number;
  successCodeEnd: number;
  failCodeStart: number;
  failCodeEnd: number;
  problemLanguage?: string;
}

/**
 * 성공/실패 코드 중 특정 라인 범위만 추출하는 유틸 함수
 */
function extractLines(code: string, start: number, end: number): string {
  const lines = code.split('\n');
  return lines.slice(start - 1, end).join('\n');
}

const MainFeedCodeBlock: React.FC<MainFeedCodeBlockProps> = ({
  successCode,
  failCode,
  successCodeStart,
  successCodeEnd,
  failCodeStart,
  failCodeEnd,
  problemLanguage,
}) => {
  const trimmedSuccessCode = extractLines(successCode, successCodeStart, successCodeEnd);
  const trimmedFailCode = extractLines(failCode, failCodeStart, failCodeEnd);

  return (
    <div className="flex flex-col md:flex-row gap-4 text-sm font-mono">
      {/* 성공 코드 */}
      <div className="w-full md:w-1/2 flex flex-col">
        <p className="mb-2 text-[13px] text-zinc-500 font-semibold font-sans">성공 코드</p>
        <div className="rounded-md p-2 overflow-auto min-h-[200px]">
          <CodePreview
            code={trimmedSuccessCode}
            language={problemLanguage}
            showLineNumbers
            startingLineNumber={successCodeStart}
          />
        </div>
      </div>

      {/* 실패 코드 */}
      <div className="w-full md:w-1/2 flex flex-col">
        <p className="mb-2 text-[13px] text-zinc-500 font-semibold font-sans">실패 코드</p>
        <div className="rounded-md p-2 overflow-auto min-h-[200px]">
          <CodePreview
            code={trimmedFailCode}
            language={problemLanguage}
            showLineNumbers
            startingLineNumber={failCodeStart}
          />
        </div>
      </div>
    </div>
  );
};

export default MainFeedCodeBlock;
