import { tierImageMap } from '../../data/tierMap';

interface ProblemTitleProps {
  problemId: number;
  problemName: string;
  problemTier: number;
  size?: number; // 티어 이미지 크기 (기본 20px)
  fontSize?: string; // 폰트 사이즈 클래스 (Tailwind, ex: 'text-sm')
}

/**
 * ProblemTitle - 티어 이미지 + 문제 번호 + 문제 이름
 * - 재사용성 높은 문제 정보 표시 컴포넌트
 */
export default function ProblemTitle({
  problemId,
  problemName,
  problemTier,
  size = 20,
  fontSize = 'text-sm',
}: ProblemTitleProps) {
  const tierSrc = tierImageMap[problemTier];

  return (
    <div className={`flex items-center gap-2 ${fontSize}`}>
      {/* 티어 이미지 */}
      {tierSrc && (
        <img
          src={tierSrc}
          alt={`티어 ${problemTier}`}
          width={size}
          height={size}
          className="object-contain"
        />
      )}

      {/* 문제 번호 + 이름 */}
      <span className="font-semibold text-[#0B0829]">
        {problemId} {problemName}
      </span>
    </div>
  );
}
