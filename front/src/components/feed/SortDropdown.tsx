import React, { useState, useRef, useEffect } from 'react';
import type { SortOption } from '../../types/feed';
import { ChevronDown } from 'lucide-react';

const sortOptions: { label: string; value: SortOption }[] = [
  { label: '최신순', value: 'latest' },
  { label: '조회순', value: 'views' },
  { label: '좋아요순', value: 'likes' },
  { label: '댓글순', value: 'comments' },
];

interface SortDropdownProps {
  selected: SortOption;
  onChange: (value: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-block text-sm text-zinc-600"
      ref={dropdownRef}
    >
      {/* 정렬 버튼 */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-28 h-[40px] border border-zinc-300 rounded-md px-3 bg-white hover:bg-zinc-50 transition text-sm"
      >
        <span className="truncate">
          {sortOptions.find((opt) => opt.value === selected)?.label}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* 드롭다운 메뉴 */}
      {open && (
        <div className="absolute z-10 mt-2 right-0 w-28 bg-white border border-zinc-200 shadow-lg rounded-lg py-2">
          {sortOptions.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-zinc-100 transition ${
                  isSelected ? 'text-black font-medium' : 'text-zinc-400'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
