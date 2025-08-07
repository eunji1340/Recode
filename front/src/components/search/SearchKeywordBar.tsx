import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchKeywordBarProps {
  /**
   * 현재 입력된 검색어 값
   */
  value: string;

  /**
   * 검색어 입력 변경 시 호출되는 핸들러
   * @param val - 새로운 검색어 문자열
   */
  onChange: (val: string) => void;
  onEnter?: () => void;
}

/**
 * SearchKeywordBar - 검색어 입력 인풋창
 * - ExplorePage, MainFeedPage 등에서 사용
 */
const SearchKeywordBar: React.FC<SearchKeywordBarProps> = ({ value, onChange, onEnter }) => {
  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]">
        <FiSearch />
      </span>
      <input
        type="text"
        placeholder="문제 제목, 사용자명, 노트 제목으로 검색"
        className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#13233D]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onEnter?.(); // 엔터 눌렀을 때 실행
          }
        }}
      />
    </div>
  );
};

export default SearchKeywordBar;
