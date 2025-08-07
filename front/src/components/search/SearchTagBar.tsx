import React, { useState } from 'react';
import { FiHash } from 'react-icons/fi';

interface SearchTagBarProps {
  /**
   * 현재 선택된 태그 목록
   */
  tags: string[];

  /**
   * 태그 추가 핸들러
   * @param tag - 추가할 태그 문자열
   */
  onAdd: (tag: string) => void;

  /**
   * 태그 제거 핸들러
   * @param tag - 제거할 태그 문자열
   */
  onRemove: (tag: string) => void;
}

/**
 * SearchTagBar - 태그 입력 및 제거 컴포넌트
 * - ExplorePage / MainFeedPage 등에서 사용
 */
const SearchTagBar: React.FC<SearchTagBarProps> = ({ tags, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setInput('');
    }
  };

  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]">
        <FiHash />
      </span>
      <div className="flex flex-wrap items-center gap-2 px-10 py-2 border rounded-md text-sm bg-white min-h-[42px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-zinc-100 px-2 py-1 rounded-full text-sm text-zinc-800"
          >
            {tag}
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
          placeholder="태그 입력"
          className="flex-1 border-none outline-none text-sm bg-transparent min-w-[80px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      </div>
    </div>
  );
};

export default SearchTagBar;
