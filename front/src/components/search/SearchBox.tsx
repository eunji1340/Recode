import React, { useRef, useState, useEffect } from 'react';
import { FiSearch, FiHash, FiRotateCcw } from 'react-icons/fi';

interface SearchBoxProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  tag: string; // 하나만 검색
  onTagChange: (tag: string) => void;
  onSearch: (nextKeyword: string, nextTag: string) => void; // 최신값 전달
  onClearAll?: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  keyword,
  onKeywordChange,
  tag,
  onTagChange,
  onSearch,
  onClearAll,
}) => {
  const [tagInput, setTagInput] = useState(tag || '');
  const tagInputRef = useRef<HTMLInputElement>(null);

  // tag props가 변경되면 tagInput도 동기화
  useEffect(() => {
    setTagInput(tag || '');
  }, [tag]);

  /** 검색 실행 */
  const triggerSearch = (nextKeyword: string, nextTag: string) => {
    onSearch(nextKeyword.trim(), nextTag.trim());
  };

  /** 키워드 입력창 엔터 */
  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // tagInput이 있으면 먼저 태그 상태를 업데이트하고 검색
      const currentTag = tagInput.trim();
      if (currentTag !== tag) {
        onTagChange(currentTag);
      }
      triggerSearch(keyword, currentTag);
    }
  };

  /** 태그 입력창 엔터 */
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      onTagChange(trimmed); // state 업데이트
      triggerSearch(keyword, trimmed); // 최신 값으로 바로 검색 실행
    } else if (e.key === 'Backspace' && tagInput === '' && tag) {
      onTagChange('');
    }
  };

  /** 검색 버튼 클릭 */
  const handleSearchClick = () => {
    const currentTag = tagInput.trim();
    if (currentTag !== tag) {
      onTagChange(currentTag);
    }
    triggerSearch(keyword, currentTag);
  };

  /** 초기화 */
  const handleReset = () => {
    if (onClearAll) {
      onClearAll();
    }
    setTagInput('');
  };

  return (
    <div className="w-full space-y-3">
      {/* 키워드 검색 */}
      <div className="flex w-full">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="문제 제목, 사용자명, 노트 제목으로 검색"
            className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#13233D]"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
          />
        </div>
        <button
          onClick={handleSearchClick}
          className="ml-2 px-4 bg-[#13233D] text-white rounded-md hover:bg-[#0f1b31] text-sm"
        >
          검색
        </button>
      </div>

      {/* 태그 검색 */}
      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]">
            <FiHash />
          </span>
          <input
            ref={tagInputRef}
            type="text"
            placeholder="태그 검색"
            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:outline-none bg-white"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>
        {/* 초기화 버튼 */}
        <div className="flex gap-4 items-center mt-2 md:mt-0">
          <button
            onClick={handleReset}
            aria-label="검색 초기화"
            className="bg-[#FF8400] hover:bg-[#e67200] text-sm flex items-center text-white rounded-md gap-1 px-3 py-2"
          >
            <FiRotateCcw className="w-4 h-4" /> 초기화
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;