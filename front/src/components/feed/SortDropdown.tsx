// components/feed/SortDropdown.tsx
import React from "react";

interface SortDropdownProps {
  selected: string;
  onChange: (value: string) => void;
}

const sortOptions = [
  { label: "최신순", value: "latest" },
  { label: "좋아요순", value: "likes" },
  { label: "댓글순", value: "comments" },
];

const SortDropdown: React.FC<SortDropdownProps> = ({ selected, onChange }) => {
  return (
    <div className="text-sm text-zinc-400 flex items-center gap-2">
      <span>정렬:</span>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-zinc-300 rounded px-2 py-1 text-zinc-600"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortDropdown;
