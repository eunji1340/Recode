import React from 'react';
import { Search, BookOpen } from 'lucide-react';

interface EmptyFeedStateProps {
  onExplore?: () => void; // 탐색 페이지로 이동
}

const EmptyFeedState: React.FC<EmptyFeedStateProps> = ({
  onExplore
}) => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-100 p-12">
      <div className="flex flex-col items-center justify-center">
        {/* 아이콘 배경 - 연한 블루 그라데이션 */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-full p-8 mb-6 border border-gray-100">
          <Search className="w-16 h-16 text-slate-600" />
        </div>
        
        {/* 메인 제목 */}
        <h3 className="text-2xl font-bold text-slate-800 mb-3">
          팔로잉 피드가 없어요
        </h3>
        
        {/* 설명 텍스트 */}
        <p className="text-slate-500 text-center mb-8 leading-relaxed max-w-md">
          검색 조건에 맞는 피드를 찾을 수 없습니다.<br />
          다른 키워드나 태그로 검색해보시거나<br />
          탐색 페이지에서 새로운 콘텐츠를 만나보세요
        </p>
        
        {/* CTA 버튼 - 블루 톤 */}
        <button 
          onClick={onExplore}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <BookOpen className="w-5 h-5" />
          탐색하러 가기
        </button>
      </div>
    </div>
  );
};

export default EmptyFeedState;