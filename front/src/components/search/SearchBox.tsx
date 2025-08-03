<<<<<<< HEAD
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
=======
// components/search/SearchBox.tsx
import React, { useState, useEffect } from 'react';
import SearchUserScopeTabs from './SearchUserScopeTabs';
import SearchKeywordBar from './SearchKeywordBar';
import SearchTagBar from './SearchTagBar';
import { FiRotateCcw } from "react-icons/fi";

interface SearchBoxProps {
  showUserScopeTabs?: boolean;
  defaultUserScope?: 'all' | 'following';
  onSearch: (params: {
    keyword: string;
    tags: string[];
    userScope?: 'all' | 'following';
  }) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  showUserScopeTabs = true,
  defaultUserScope = 'all',
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userScope, setUserScope] = useState<'all' | 'following'>(defaultUserScope);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    setUserScope(defaultUserScope);
  }, [defaultUserScope]);

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()]);
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
<<<<<<< HEAD
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSearch = () => {
    onSearch({ keyword: searchTerm, tags: selectedTags });
=======
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSearch = () => {
    onSearch({
      keyword: searchTerm,
      tags: selectedTags,
      userScope: showUserScopeTabs ? userScope : undefined,
    });
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedTags([]);
<<<<<<< HEAD
    onSearch({ keyword: '', tags: [] });
=======
    setUserScope(defaultUserScope);
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
  };

  return (
    <div className="w-full space-y-2">
<<<<<<< HEAD
      {/* 키워드 검색 & 검색 버튼 */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
=======
      {showUserScopeTabs && (
        <SearchUserScopeTabs value={userScope} onChange={setUserScope} />
      )}

      <div className="flex flex-col md:flex-row gap-2 items-stretch">
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
        <SearchKeywordBar value={searchTerm} onChange={setSearchTerm} />
        <button
          onClick={handleSearch}
          className="bg-[#13233D] hover:bg-[#0f1b30] text-white text-sm px-5 rounded-md whitespace-nowrap"
        >
          검색
        </button>
      </div>

<<<<<<< HEAD
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
=======
      <div className="flex flex-col md:flex-row gap-2 items-stretch">
        <SearchTagBar tags={selectedTags} onAdd={handleAddTag} onRemove={handleRemoveTag} />
        <button
          onClick={handleReset}
          className="text-sm flex items-center text-[#13233D] whitespace-nowrap gap-1 px-1"
        >
          <FiRotateCcw className="w-4 h-4" /> 초기화
        </button>
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default SearchBox;
=======
export default SearchBox;
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
