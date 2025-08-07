import React, { useState, useRef } from 'react';
import { FiSearch, FiHash, FiRotateCcw } from 'react-icons/fi';
import SortDropdown from '../feed/SortDropdown';
import type { SortOption } from '../../types/feed';

interface SearchBoxProps {
  onKeywordChange: (keyword: string) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  selectedTags: string[];
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  onKeywordChange,
  onAddTag,
  onRemoveTag,
  selectedTags,
  sortBy,
  onSortChange,
}) => {
  const [keyword, setKeyword] = useState('');
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    onKeywordChange(val);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !selectedTags.includes(trimmed)) {
        onAddTag(trimmed);
        setTagInput('');
      }
    } else if (
      e.key === 'Backspace' &&
      tagInput === '' &&
      selectedTags.length > 0
    ) {
      onRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleReset = () => {
    setKeyword('');
    setTagInput('');
    onKeywordChange('');
    selectedTags.forEach((tag) => onRemoveTag(tag));
  };

  return (
    <div className="w-full space-y-3">
      {/* 키워드 검색창 */}
      <div className="relative w-full">
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]">
          <FiSearch />
        </span>
        <input
          type="text"
          placeholder="문제 제목 혹은 사용자명으로 검색"
          className="w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#13233D]"
          value={keyword}
          onChange={handleKeywordChange}
        />
      </div>

      {/* 태그 검색창 */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]">
            <FiHash />
          </span>
          <div className="flex flex-wrap items-center gap-2 px-10 py-2 border rounded-md text-sm bg-white min-h-[42px]">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center bg-zinc-100 px-2 py-1 rounded-full text-sm text-zinc-800"
              >
                #{tag}
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="ml-1 text-zinc-500 hover:text-red-500 transition"
                  aria-label={`${tag} 제거`}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              ref={tagInputRef}
              type="text"
              placeholder="태그 검색"
              className="flex-1 border-none outline-none text-sm bg-transparent min-w-[80px]"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
          </div>
        </div>

        {/* 초기화 & 정렬 */}
        <div className="flex gap-4 items-center mt-2 md:mt-0">
          <button
            onClick={handleReset}
            aria-label="검색 초기화"
            className="bg-[#FF8400] hover:bg-[#e67200] text-sm flex items-center text-white rounded-md gap-1 px-3 py-2"
          >
            <FiRotateCcw className="w-4 h-4" /> 초기화
          </button>
          <SortDropdown selected={sortBy} onChange={onSortChange} />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
