import React from 'react';
import { FiSearch } from "react-icons/fi";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const SearchKeywordBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#13233D]"><FiSearch /></span>
      <input
        type="text"
        placeholder="문제 제목 혹은 사용자명으로 검색"
        className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchKeywordBar;