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
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSearch = () => {
    onSearch({
      keyword: searchTerm,
      tags: selectedTags,
      userScope: showUserScopeTabs ? userScope : undefined,
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedTags([]);
    setUserScope(defaultUserScope);
  };

  return (
    <div className="w-full space-y-2">
      {showUserScopeTabs && (
        <SearchUserScopeTabs value={userScope} onChange={setUserScope} />
      )}

      <div className="flex flex-col md:flex-row gap-2 items-stretch">
        <SearchKeywordBar value={searchTerm} onChange={setSearchTerm} />
        <button
          onClick={handleSearch}
          className="bg-[#13233D] hover:bg-[#0f1b30] text-white text-sm px-5 rounded-md whitespace-nowrap"
        >
          검색
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-2 items-stretch">
        <SearchTagBar tags={selectedTags} onAdd={handleAddTag} onRemove={handleRemoveTag} />
        <button
          onClick={handleReset}
          className="text-sm flex items-center text-[#13233D] whitespace-nowrap gap-1 px-1"
        >
          <FiRotateCcw className="w-4 h-4" /> 초기화
        </button>
      </div>
    </div>
  );
};

export default SearchBox;