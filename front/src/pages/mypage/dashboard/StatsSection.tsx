// src/pages/mypage/StatsSection.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export interface TagCount {
  tagName: string;
  count: number;
  color: string;
}

interface Props {
  totalCount: number;
  tagCounts: TagCount[];
}

export default function StatsSection({ totalCount, tagCounts }: Props) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md flex">
      <div style={{ width: 200, height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={tagCounts}
              dataKey="count"
              nameKey="tagName"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              {tagCounts.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}개`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-[-80px] font-bold text-xl">{totalCount}</div>
      </div>

      <div className="ml-8 flex-1">
        <h3>생성된 오답노트 개수: {totalCount}</h3>
        <h3 className="text-lg font-semibold mb-4">태그별 오답노트</h3>
        <ul>
          {tagCounts.map(t => (
            <li key={t.tagName} className="flex items-center mb-2">
              <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: t.color }} />
              <span className="flex-1">{t.tagName}</span>
              <span className="font-medium">{t.count}개</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
