import React from 'react';
import { FiSearch } from "react-icons/fi";

interface EmptyStateProps {
  /** 메인 제목 */
  title: string;
  /** 설명 텍스트 */
  description: string;
  /** CTA 버튼 텍스트 (선택사항) */
  buttonText?: string;
  /** CTA 버튼 클릭 핸들러 (선택사항) */
  onButtonClick?: () => void;
  /** 컨테이너 크기 조절 */
  size?: 'sm' | 'md' | 'lg';
  /** 배경 표시 여부 */
  showBackground?: boolean;
}

/**
 * 빈 상태를 표시하는 재사용 가능한 컴포넌트
 * 다양한 페이지에서 "데이터 없음" 상태를 일관되게 표시
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  onButtonClick,
  size = 'md',
  showBackground = true
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-8',
      iconWrapper: 'p-6 mb-4',
      icon: 'w-12 h-12',
      title: 'text-lg font-bold',
      description: 'text-sm mb-6',
      button: 'px-6 py-2 text-sm'
    },
    md: {
      container: 'p-12',
      iconWrapper: 'p-8 mb-6',
      icon: 'w-16 h-16',
      title: 'text-2xl font-bold',
      description: 'text-base mb-8',
      button: 'px-8 py-3 text-base'
    },
    lg: {
      container: 'p-16',
      iconWrapper: 'p-10 mb-8',
      icon: 'w-20 h-20',
      title: 'text-3xl font-bold',
      description: 'text-lg mb-10',
      button: 'px-10 py-4 text-lg'
    }
  };

  const currentSize = sizeClasses[size];

  const containerClasses = showBackground
    ? `bg-white rounded-xl shadow border border-gray-100 ${currentSize.container}`
    : `${currentSize.container}`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        {/* 아이콘 배경 */}
        <div className={`bg-gradient-to-br from-[#A0BACC]/10 to-[#A0BACC]/20 rounded-full border border-[#A0BACC]/30 ${currentSize.iconWrapper}`}>
          <FiSearch className={`${currentSize.icon} text-[#13233D]`} />
        </div>
        
        {/* 메인 제목 */}
        <h3 className={`${currentSize.title} text-[#0B0829] mb-3 text-center`}>
          {title}
        </h3>
        
        {/* 설명 텍스트 */}
        <p className={`text-[#13233D]/70 text-center leading-relaxed max-w-md ${currentSize.description}`}>
          {description}
        </p>
        
        {/* CTA 버튼 (선택사항) */}
        {buttonText && onButtonClick && (
          <button 
            onClick={onButtonClick}
            className={`flex items-center gap-2 bg-[#FF8400] hover:bg-[#FF8400]/90 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 ${currentSize.button}`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;