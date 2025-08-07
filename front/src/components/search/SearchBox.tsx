import React, { useCallback, useState } from 'react';
import SearchKeywordBar from './SearchKeywordBar';
import SearchTagBar from './SearchTagBar';
import { FiRotateCcw } from 'react-icons/fi';
import SortDropdown from '../feed/SortDropdown';
import type { SortOption } from '../../types/feed';

interface SearchBoxProps {
  onSearch: (params: { search: string; tags: string[] }) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, sortBy, onSortChange }) => {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSearch = useCallback(() => {
    onSearch({ search: search.trim(), tags });
  }, [search, tags, onSearch]);

  const handleAddTag = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      const newTags = [...tags, trimmed];
      setTags(newTags);
      onSearch({ search: search.trim(), tags: newTags }); // 태그 추가 즉시 검색 수행
    }
  }, [tags, search, onSearch]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    onSearch({ search: search.trim(), tags: newTags });
  }, [tags, search, onSearch]);

  const handleReset = () => {
    setSearch('');
    setTags([]);
    onSearch({ search: '', tags: [] });
  };

  return (
    <div className="w-full space-y-2">
      {/* 키워드 검색 + 검색 버튼 */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <SearchKeywordBar
          value={search}
          onChange={setSearch}
          onEnter={handleSearch}
        />
        <button
          onClick={handleSearch}
          aria-label="검색"
          className="bg-[#13233D] hover:bg-[#0f1b30] text-white text-sm px-5 py-2 rounded-md"
        >
          검색
        </button>
      </div>

      {/* 태그 검색 + 초기화 + 정렬 */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <SearchTagBar
          tags={tags}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
        />
        <div className="flex gap-4 items-center">
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
