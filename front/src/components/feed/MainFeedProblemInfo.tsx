import React from 'react';
import ProblemTitle from '../feed/ProblemTitle';

interface MainFeedProblemInfoProps {
  problemId: number;
  problemName: string;
  problemTier: number;
  problemLanguage?: string; // 언어는 optional 처리
}

/**
 * MainFeedProblemInfo - 문제 정보 + 언어 정보
 * - 문제 티어/ID/제목 + 사용 언어 아이콘과 이름
 */
const MainFeedProblemInfo: React.FC<MainFeedProblemInfoProps> = ({
  problemId,
  problemName,
  problemTier,
  problemLanguage,
}) => {
  /**
   * 언어명에 따라 devicon 아이콘 URL 생성
   * 예외 처리: C++, C# 등
   */
  const getLanguageIconUrl = (lang: string): string => {
    const exceptions: Record<string, string> = {
      'C++': 'cplusplus',
      'C#': 'csharp',
    };
    const key = exceptions[lang] ?? lang.toLowerCase();
    return `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`;
  };

  return (
    <div className="flex justify-between items-center">
      <ProblemTitle
        problemId={problemId}
        problemName={problemName}
        problemTier={problemTier}
        fontSize="text-base"
      />

      {problemLanguage && (
        <div className="flex items-center gap-1 text-sm">
          <img
            src={getLanguageIconUrl(problemLanguage)}
            alt={`${problemLanguage} icon`}
            className="w-5 h-5"
          />
          <span className="font-mono">{problemLanguage}</span>
        </div>
      )}
    </div>
  );
};

export default MainFeedProblemInfo;
