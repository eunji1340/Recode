import React from 'react';
import CodePreview from '../code/CodePreview';

interface MainFeedCodeBlockProps {
  successCode: string;
  failCode: string;
  successCodeStart: number;
  failCodeStart: number;
  problemLanguage?: string;
}

function extractLinesWithLimit(code: string, start?: number, limit: number = 10): string {
  const lines = code.split('\n');

  // start가 없거나 1보다 작으면 맨 앞에서 limit줄
  if (!start || start < 1) {
    return lines.slice(0, limit).join('\n');
  }

  // start부터 limit줄
  return lines.slice(start - 1, start - 1 + limit).join('\n');
}

const MainFeedCodeBlock: React.FC<MainFeedCodeBlockProps> = ({
  successCode,
  failCode,
  successCodeStart,
  failCodeStart,
  problemLanguage,
}) => {
  const LINE_LIMIT = 10;

  const trimmedSuccessCode = extractLinesWithLimit(successCode, successCodeStart, LINE_LIMIT);
  const trimmedFailCode = extractLinesWithLimit(failCode, failCodeStart, LINE_LIMIT);

  return (
    <div className="flex flex-col md:flex-row gap-4 text-sm font-mono">
      {/* 성공 코드 */}
      <div className="w-full md:w-1/2 flex flex-col">
        <p className="mb-2 text-[13px] text-zinc-500 font-semibold font-sans">성공 코드</p>
        <div className="rounded-md p-2 overflow-auto min-h-[200px] bg-white">
          <CodePreview
            code={trimmedSuccessCode}
            language={problemLanguage}
            showLineNumbers
            startingLineNumber={successCodeStart && successCodeStart > 0 ? successCodeStart : 1}
          />
        </div>
      </div>

      {/* 실패 코드 */}
      <div className="w-full md:w-1/2 flex flex-col">
        <p className="mb-2 text-[13px] text-zinc-500 font-semibold font-sans">실패 코드</p>
        <div className="rounded-md p-2 overflow-auto min-h-[200px] bg-white">
          <CodePreview
            code={trimmedFailCode}
            language={problemLanguage}
            showLineNumbers
            startingLineNumber={failCodeStart && failCodeStart > 0 ? failCodeStart : 1}
          />
        </div>
      </div>
    </div>
  );
};

export default MainFeedCodeBlock;
