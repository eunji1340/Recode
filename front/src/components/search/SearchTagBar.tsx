// src/components/search/SearchTagBar.tsx

import React, { useState } from 'react';
import { FiHash } from 'react-icons/fi';

interface SearchTagBarProps {
  /**
   * 현재 선택된 태그 목록
   */
  tags: string[];

  /**
   * 태그 추가 핸들러
   */
  onAdd: (tag: string) => void;

  /**
   * 태그 제거 핸들러
   */
  onRemove: (tag: string) => void;
}

/**
 * SearchTagBar - 태그 입력 및 제거 컴포넌트
 * - ExplorePage / MyPage / FeedPage 등에서 재사용 가능
 */
const SearchTagBar: React.FC<SearchTagBarProps> = ({ tags, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleAddTag = () => {
    const trimmed = input.trim();
    if (trimmed !== '' && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      onRemove(tags[tags.length - 1]); // 마지막 태그 제거
    }
  };

  return (
    <div className="relative flex-1">
      {/* 해시 아이콘 */}
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]">
        <FiHash />
      </span>

      {/* 태그 목록 + 입력창 */}
      <div className="flex flex-wrap items-center gap-2 px-10 py-2 border border-zinc-300 rounded-md text-sm bg-white min-h-[42px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-zinc-100 px-2 py-1 rounded-full text-sm text-zinc-800"
          >
            #{tag}
            <button
              onClick={() => onRemove(tag)}
              className="ml-1 text-zinc-500 hover:text-red-500 transition"
              aria-label={`${tag} 제거`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          placeholder="태그 입력 후 Enter"
          className="flex-1 border-none outline-none text-sm bg-transparent min-w-[80px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default SearchTagBar;
