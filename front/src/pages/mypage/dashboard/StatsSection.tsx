// src/pages/mypage/StatsSection.tsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  // 1) 내림차순 정렬
  const sortedTags = [...tagCounts].sort((a, b) => b.count - a.count);
  // 2) 5개 초과 여부
  const isScrollable = sortedTags.length > 5;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {totalCount === 0 ? (
        /* zero-case 생략... */
        <div className="w-full flex flex-col justify-center items-center py-12 min-h-[200px]">
          <p className="mb-6 text-gray-600 text-center">
            아직 생성된 오답노트가 없습니다.<br />
            오답노트를 작성해 보세요
          </p>
          <button
            onClick={() => navigate('/note/generate')}
            className="px-6 py-2 bg-primary hover:bg-accent text-white rounded-md font-medium"
          >
            생성하기
          </button>
        </div>
      ) : (
        <div className="flex">
          {/* 차트 영역 (변경 없음) */}
          <div style={{ width: 200, height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sortedTags}
                  dataKey="count"
                  nameKey="tagName"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {sortedTags.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}개`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 태그 리스트 영역 */}
          <div className="ml-8 flex-1">
            <h3 className="text-lg font-semibold mb-2">
              생성된 오답노트 개수: {totalCount}
            </h3>
            <h3 className="text-lg font-semibold mb-4">
              태그별 오답노트
            </h3>
            <ul
              className={`space-y-2 ${
                isScrollable ? 'max-h-40 overflow-y-auto' : ''
              }`}
            >
              {sortedTags.map(t => (
                <li key={t.tagName} className="flex items-center">
                  <span
                    className="w-4 h-4 rounded-sm mr-2"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="flex-1">{t.tagName}</span>
                  <span className="font-medium">{t.count}개</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
