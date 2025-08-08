// src/utils/date.ts

/** API에서 내려오는 일자형 데이터 */
export type DailyCount = { date: string; count: number }; // e.g. "2025.08.08"

/** "YYYY.MM.DD" → Date (로컬, 자정) */
export function parseApiDate(d: string): Date {
  const [y, m, dd] = d.split('.').map(Number);
  const x = new Date(y, m - 1, dd);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Date → 'YYYY-MM-DD' (맵 키/표시에 사용) */
export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** 오늘 00:00 */
export function todayAtMidnight(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}

/** d + n일 (자정 정규화) */
export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** d가 [start, end] 범위(자정 기준)에 포함되는가 */
export function inRange(d: Date, start: Date, end: Date): boolean {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  return t.getTime() >= start.getTime() && t.getTime() <= end.getTime();
}

/** d + delta개월 (자정 정규화, 같은 일 유지) */
export function addMonths(d: Date, delta: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + delta);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** 해당 달 1일 00:00 */
export function startOfMonth(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** 해당 달 마지막일 00:00 */
export function endOfMonth(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Date → 'YYYY-MM-DD' (쿼리 파라미터로 주로 사용) */
export function fmtISO(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** 기준 달의 [시작~끝] ISO 문자열 */
export function monthRangeISO(base: Date): { from: string; to: string } {
  const s = startOfMonth(base);
  const e = endOfMonth(base);
  return { from: fmtISO(s), to: fmtISO(e) };
}

/** 주 시작(일요일) 00:00 */
export function startOfWeekSunday(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0=Sun..6=Sat
  const diff = -day; // 일요일로 이동
  x.setDate(x.getDate() + diff);
  return x;
}


/** 기준일이 속한 주(월~일) 날짜 배열 */
export function getWeekDays(base: Date): Date[] {
  const start = startOfWeekSunday(base);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * 월요일 시작 7열 그리드용 달력 셀 배열.
 * fill='empty' → 앞/뒤 빈칸은 null
 * fill='nextMonth' → 뒤쪽 빈칸은 다음 달 Date로 채움(흐리게 표시용)
 */
export function monthMatrix(
  monthBase: Date,
  fill: 'empty' | 'nextMonth' = 'empty'
): { days: (Date | null)[] } {
  const first = startOfMonth(monthBase);
  const last = endOfMonth(monthBase);

  // 앞쪽(이전 달) 빈칸 개수: Mon=0..Sun=6
  const leading = first.getDay();
  const days: (Date | null)[] = Array(leading).fill(null);

  // 이번 달
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(first.getFullYear(), first.getMonth(), d));
  }

  // 뒤쪽(다음 달) 채우기
  const trailing = (7 - (days.length % 7)) % 7;
  if (fill === 'empty') {
    for (let i = 0; i < trailing; i++) days.push(null);
  } else {
    for (let i = 0; i < trailing; i++) {
      days.push(new Date(last.getFullYear(), last.getMonth() + 1, i + 1));
    }
  }

  return { days };
}

/** DailyCount 배열 → { 'YYYY-MM-DD': count } 맵 */
export function buildCountMap(rows: DailyCount[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const r of rows ?? []) {
    const key = toKey(parseApiDate(r.date));
    map[key] = (map[key] ?? 0) + r.count;
  }
  return map;
}
