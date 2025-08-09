import React, { useState } from 'react';
import { FiHash } from "react-icons/fi";

interface Props {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

const SearchTagBar: React.FC<Props> = ({ tags, onAdd, onRemove }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]"><FiHash /></span>
      <div className="flex flex-wrap items-center gap-1 px-10 py-2 border rounded-md text-sm bg-white">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-800">
            {tag}
            <button onClick={() => onRemove(tag)} className="ml-1">×</button>
          </span>
        ))}
        <input
          type="text"
          placeholder="태그 검색"
          className="flex-1 border-none outline-none text-sm"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
      </div>
    </div>
  );
};

export default SearchTagBar;
