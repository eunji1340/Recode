import React from 'react';
import { toKey } from '../../../utils/date'; // 경로 수정

type WeekItem = { date: Date; count: number };

interface Props {
  todayStreak: number;
  maxStreak: number;
  week: WeekItem[]; // 길이 7, 월~일
  onOpenCalendar: () => void;
}

function badgeClassByCount(c: number) {
  if (c >= 5) return 'bg-emerald-700 text-white';
  if (c >= 3) return 'bg-emerald-500 text-white';
  if (c >= 1) return 'bg-emerald-200';
  return 'bg-gray-200 text-gray-600';
}

const wdays = ['일', '월', '화', '수', '목', '금', '토'];

export default function StreakSection({ todayStreak, maxStreak, week, onOpenCalendar }: Props) {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">스트릭</h3>
        <div className="text-sm text-gray-500">
          최다 기록 {maxStreak}일, 현재 연속{" "}
          <span className="font-bold">
            {todayStreak}일차 {todayStreak > 0 && "🔥"}
          </span>
        </div>
      </div>

      <button
        onClick={onOpenCalendar}
        className="w-full rounded-xl border border-gray-200 p-4 hover:bg-gray-50 transition"
        aria-label="한 달 보기"
      >
        <div className="grid grid-cols-7 gap-3">
          {week.map((w, i) => (
            <div key={toKey(w.date)} className="flex flex-col items-center gap-2">
              <div className="text-sm text-gray-500">{wdays[i]}</div>
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${badgeClassByCount(w.count)}`}
                title={`${w.count}개`}
              >
                <span className="text-sm font-medium">{w.count || ''}</span>
              </div>
            </div>
          ))}
        </div>
      </button>
    </div>
  );
}
