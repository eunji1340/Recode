// src/pages/mypage/dashboard/StreakCalendarModal.tsx
import React from 'react';
import { monthMatrix, toKey } from '../../../utils/date';

interface Props {
  open: boolean;
  onClose: () => void;
  monthBase: Date; // 이번 달 기준
  counts: Record<string, number>; // 'YYYY-MM-DD' → count
  onPrevMonth: () => void; // ← 추가
  onNextMonth: () => void; // ← 추가
}

function colorByCount(c: number) {
  if (c >= 5) return 'bg-emerald-700 text-white';
  if (c >= 3) return 'bg-emerald-500 text-white';
  if (c >= 1) return 'bg-emerald-200';
  return 'bg-gray-200 text-gray-600';
}

const head = ['일','월','화','수','목','금','토'];

export default function StreakCalendarModal({
  open, onClose, monthBase, counts, onPrevMonth, onNextMonth
}: Props) {  if (!open) return null;
  const { days } = monthMatrix(monthBase);
  const ym = `${monthBase.getFullYear()}년 ${monthBase.getMonth()+1}월`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] max-w-[92vw] rounded-2xl p-6 shadow-xl">
<div className="flex items-center justify-between mb-4">
  <div className="flex items-center gap-2">
    <button
      onClick={onPrevMonth}
      className="px-2 py-1 rounded-lg border hover:bg-gray-50"
      aria-label="이전 달"
    >
      ◀
    </button>
    <h4 className="text-lg font-semibold min-w-[120px] text-center">
      {ym} 스트릭
    </h4>
    <button
      onClick={onNextMonth}
      className="px-2 py-1 rounded-lg border hover:bg-gray-50"
      aria-label="다음 달"
    >
      ▶
    </button>
  </div>

  <button
    onClick={onClose}
    className="px-3 py-1 rounded-lg border hover:bg-gray-50"
  >
    닫기
  </button>
</div>


        <div className="grid grid-cols-7 gap-3 mb-3">
          {head.map(h => <div key={h} className="text-center text-sm text-gray-500">{h}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-3">
          {days.map((d, i) => {
            if (!d) return <div key={i} />;
            const key = toKey(d);
            const c = counts[key] ?? 0;
            return (
              <div
                key={key}
                className={`h-16 rounded-xl flex flex-col items-center justify-center ${colorByCount(c)}`}
                title={`${key} : ${c}개`}
              >
                <div className="text-xs opacity-80">{d.getDate()}</div>
                <div className="text-sm font-medium">{c > 0? `${c}개` : ''}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2">
            <i className="inline-block w-4 h-4 rounded bg-gray-200" /> 0개
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="inline-block w-4 h-4 rounded bg-emerald-200" /> 1개 이상
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="inline-block w-4 h-4 rounded bg-emerald-500" /> 3개 이상
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="inline-block w-4 h-4 rounded bg-emerald-700" /> 5개 이상
          </span>
        </div>
      </div>
    </div>
  );
}
