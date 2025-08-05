import React from 'react';

type ScopeType = 'all' | 'following';

const labelMap: Record<ScopeType, string> = {
  all: '전체',
  following: '팔로잉',
};

interface Props {
  value: ScopeType;
  onChange: (val: ScopeType) => void;
}

const UserScopeTabs: React.FC<Props> = ({ value, onChange }) => {
  const tabs: ScopeType[] = ['all', 'following'];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          onClick={() => onChange(tab)}
          className={`px-3 py-2 text-sm text-sm -mb-px trasition-all duration-200 font-medium border-b-2
            ${
              value === tab
                ? 'text-[#13233D] border-[#13233D]'
                : 'text-gray-500 border-transparent hover-text-gray-700 hover:border-gray-300'
            }`}
        >
          {labelMap[tab]}
        </button>
      ))}
    </div>
  );
};

export type { ScopeType };
export default UserScopeTabs;
