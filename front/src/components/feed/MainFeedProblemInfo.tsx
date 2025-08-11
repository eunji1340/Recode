import React from 'react';
import ProblemTitle from '../feed/ProblemTitle';
import LanguageIcon from '../common/LanguageIcon';

interface MainFeedProblemInfoProps {
  problemId: number;
  problemName: string;
  problemTier: number;
  problemLanguage?: string; // 언어는 optional
  languageIconSize?: number; // 아이콘 크기 조절
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
  languageIconSize = 22,
}) => {
  return (
    <div className="flex justify-between items-center">
      <ProblemTitle
        problemId={problemId}
        problemName={problemName}
        problemTier={problemTier}
        fontSize="text-base"
      />

      {problemLanguage && (
        <LanguageIcon
          language={problemLanguage}
          size={languageIconSize}
        />
      )}
    </div>
  );
};

export default MainFeedProblemInfo;
