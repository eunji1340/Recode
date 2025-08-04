import React, { useState } from 'react';
import SearchKeywordBar from './SearchKeywordBar';
import SearchTagBar from './SearchTagBar';
import { FiRotateCcw } from 'react-icons/fi';
import SortDropdown from '../feed/SortDropdown';
import type { SortOption } from "../../types/feed";

interface SearchBoxProps {
  onSearch: (params: {
    keyword: string;
    tags: string[];
  }) => void;

  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, sortBy, onSortChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSearch = () => {
    onSearch({ keyword: searchTerm, tags: selectedTags });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedTags([]);
    onSearch({ keyword: '', tags: [] });
  };

  return (
    <div className="w-full space-y-2">
      {/* 키워드 검색 & 검색 버튼 */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <SearchKeywordBar value={searchTerm} onChange={setSearchTerm} />
        <button
          onClick={handleSearch}
          className="bg-[#13233D] hover:bg-[#0f1b30] text-white text-sm px-5 rounded-md whitespace-nowrap"
        >
          검색
        </button>
      </div>

      {/* 태그 선택 + 초기화 버튼 + 정렬 */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <SearchTagBar tags={selectedTags} onAdd={handleAddTag} onRemove={handleRemoveTag} />
        <div className="flex gap-4 items-center">
          <button
            onClick={handleReset}
            className="bg-[#FF8400] text-sm flex items-center text-white rounded-md whitespace-nowrap gap-1 px-3 py-2"
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
