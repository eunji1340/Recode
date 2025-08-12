import React from 'react';

type ScopeType = 'all' | 'following';

const labelMap: Record<ScopeType, string> = {
  all: '전체',
  following: '팔로잉',
};

interface SearchUserScopeTabsProps {
  /**
   * 현재 선택된 유저 범위 값 ('all' | 'following')
   */
  value: ScopeType;

  /**
   * 범위 변경 핸들러
   * @param val - 새로운 범위 값
   */
  onChange: (val: ScopeType) => void;
}

/**
 * SearchUserScopeTabs - 유저 범위 필터 탭 (전체 / 팔로잉)
 */
const SearchUserScopeTabs: React.FC<SearchUserScopeTabsProps> = ({
  value,
  onChange,
}) => {
  const tabs: ScopeType[] = ['all', 'following'];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          onClick={() => onChange(tab)}
          className={`px-3 py-2 text-sm font-medium transition-all duration-200 border-b-2
            ${
              value === tab
                ? 'text-[#13233D] border-[#13233D]'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
        >
          {labelMap[tab]}
        </button>
      ))}
    </div>
  );
};

export type { ScopeType };
export default SearchUserScopeTabs;