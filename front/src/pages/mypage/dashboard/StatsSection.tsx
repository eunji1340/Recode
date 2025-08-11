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
  nickname?: string;
}

export default function StatsSection({ totalCount, tagCounts, nickname }: Props) {
  const navigate = useNavigate();
  const sortedTags = [...tagCounts].sort((a, b) => b.count - a.count);
  const isScrollable = sortedTags.length > 5;
  
// 가장 많이 작성한 태그들
const maxCount = sortedTags.length > 0 ? sortedTags[0].count : 0;
const mostFrequentTags = sortedTags.filter(t => t.count === maxCount);

// 가장 적게 작성한 태그들
const minCount = sortedTags.length > 0 ? sortedTags[sortedTags.length - 1].count : 0;
const leastFrequentTags = sortedTags.filter(t => t.count === minCount);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      {totalCount === 0 ? (
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
        <>
          {/* 제목 */}
          <h1 className="text-xl font-extrabold mb-6">통계</h1>

          {/* 차트 + 태그 리스트 */}
          <div className="flex items-start">
            {/* 차트 영역 */}
            <div className="w-[220px] h-[220px] flex-shrink-0">
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
            <div className="ml-2 flex-1">
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
                <li key={t.tagName} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: t.color }}
                  />
                  <span>{t.tagName}</span>
                  <span className="font-medium">{t.count}개</span>
                </li>
              ))}

              </ul>
            </div>
            {/* 태그 리스트 영역 */}
            <div className="ml-8 flex-1 space-y-4">
              <h3 className="text-lg font-semibold mb-2">
                 {nickname}님은
              </h3>
              <div>
                # {mostFrequentTags.map(t => t.tagName).join(', ')} 유형의 오답노트를 가장 많이 작성했어요.
              </div>
              <div>
                # {leastFrequentTags.map(t => t.tagName).join(', ')} 유형의 오답노트를 가장 적게 작성했어요.
              </div>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}
