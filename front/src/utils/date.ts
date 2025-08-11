// src/utils/date.ts

/** API에서 내려오는 일자형 데이터 */
export type DailyCount = { date: string; count: number }; // e.g. "2025.08.08"

/** ===== KST 유틸 상수/헬퍼 ===== */
// const KST = 'Asia/Seoul';
const DAY_MS = 24 * 60 * 60 * 1000;
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** Date → KST 시각으로 이동한 '뷰' (내부 값은 유지, 보정된 뷰 반환용) */
function toKST(date: Date): Date {
  return new Date(date.getTime() + KST_OFFSET_MS);
}
/** KST 시각(뷰) → 실제 UTC Date (내부 값 보정) */
function fromKST(kstDateView: Date): Date {
  return new Date(kstDateView.getTime() - KST_OFFSET_MS);
}

/** KST 기준 Y,M,D 를 KST 자정으로 나타내는 Date(UTC 내부값) */
function dateFromKSTYMD(y: number, m1: number, d: number): Date {
  // KST 자정은 UTC 로는 전날 15:00 이므로, UTC 자정에서 9시간 빼서 생성
  const utcMidnight = Date.UTC(y, m1 - 1, d);
  return new Date(utcMidnight - KST_OFFSET_MS);
}

/** Date → KST 기준 Y,M,D */
function getKSTYMD(date: Date): { y: number; m: number; d: number } {
  const k = toKST(date);
  return {
    y: k.getUTCFullYear(),
    m: k.getUTCMonth() + 1,
    d: k.getUTCDate(),
  };
}

/** Date → 'YYYY-MM-DD' (항상 KST 기준) */
export function toKey(d: Date): string {
  const { y, m, d: dd } = getKSTYMD(d);
  return `${y}-${String(m).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
}

/** Date → 'YYYY-MM-DD' (쿼리 파라미터 등에 사용, KST 기준) */
export function fmtISO(d: Date): string {
  return toKey(d);
}

/** 'YYYY.MM.DD' → Date (KST 자정) */
export function parseApiDate(src: string): Date {
  const [y, m, dd] = src.split('.').map(Number);
  return dateFromKSTYMD(y, m, dd);
}

/** 오늘 KST 자정 */
export function todayAtMidnight(): Date {
  const now = new Date();
  const { y, m, d } = getKSTYMD(now);
  return dateFromKSTYMD(y, m, d);
}

/** d + n일 (KST 자정 정규화) */
export function addDays(d: Date, n: number): Date {
  // 기준을 KST 자정으로 정규화 후 일 단위 이동
  const base = todayOf(d);
  return fromKST(new Date(toKST(base).getTime() + n * DAY_MS));
}
/** 임의 Date를 해당 KST 날짜의 자정으로 정규화 */
function todayOf(d: Date): Date {
  const { y, m, d: dd } = getKSTYMD(d);
  return dateFromKSTYMD(y, m, dd);
}

/** d가 [start, end] 범위(모두 KST 자정 기준)에 포함되는가 */
export function inRange(d: Date, start: Date, end: Date): boolean {
  const t = todayOf(d).getTime();
  return t >= todayOf(start).getTime() && t <= todayOf(end).getTime();
}

/** d + delta개월 (KST 자정 정규화, 같은 일 유지) */
export function addMonths(d: Date, delta: number): Date {
  const { y, m, d: dd } = getKSTYMD(d);
  const targetMonth0 = (m - 1) + delta;
  const ty = y + Math.floor(targetMonth0 / 12);
  const tm = (targetMonth0 % 12 + 12) % 12; // 0..11

  // 해당 월의 말일보다 큰 일자를 요청하면 말일로 클램프
  const dim = daysInMonth(ty, tm + 1);
  const day = Math.min(dd, dim);

  return dateFromKSTYMD(ty, tm + 1, day);
}

function daysInMonth(y: number, m1: number): number {
  // m1은 1..12
  // UTC에서 다음 달 0일 = 해당 월 마지막 날
  return new Date(Date.UTC(y, m1, 0)).getUTCDate();
}

/** 해당 달 1일 KST 자정 */
export function startOfMonth(d: Date): Date {
  const { y, m } = getKSTYMD(d);
  return dateFromKSTYMD(y, m, 1);
}

/** 해당 달 마지막일 KST 자정 */
export function endOfMonth(d: Date): Date {
  const { y, m } = getKSTYMD(d);
  const dim = daysInMonth(y, m);
  return dateFromKSTYMD(y, m, dim);
}

/** 기준 달의 [시작~끝] ISO 문자열(KST) */
export function monthRangeISO(base: Date): { from: string; to: string } {
  const s = startOfMonth(base);
  const e = endOfMonth(base);
  return { from: fmtISO(s), to: fmtISO(e) };
}

/** KST 기준 요일: 0=Sun..6=Sat */
function kstWeekday(d: Date): number {
  return toKST(d).getUTCDay();
}

/** 주 시작(일요일) KST 자정 */
export function startOfWeekSunday(d: Date): Date {
  const base = todayOf(d);
  const w = kstWeekday(base); // 0..6
  return addDays(base, -w);
}

/** 기준일이 속한 주(일~토) 날짜 배열 (KST) */
export function getWeekDays(base: Date): Date[] {
  const start = startOfWeekSunday(base);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/**
 * 월요일 시작 7열 그리드가 아니라 '일요일 시작' 7열 그리드용 달력 셀 배열.
 * fill='empty' → 앞/뒤 빈칸은 null
 * fill='nextMonth' → 뒤쪽 빈칸은 다음 달 Date로 채움(흐리게 표시용)
 */
export function monthMatrix(
  monthBase: Date,
  fill: 'empty' | 'nextMonth' = 'empty'
): { days: (Date | null)[] } {
  const first = startOfMonth(monthBase);
  const last = endOfMonth(monthBase);

  // 앞쪽(이전 달) 빈칸 개수: Sun=0..Sat=6 (KST)
  const leading = kstWeekday(first);
  const days: (Date | null)[] = Array(leading).fill(null);

  // 이번 달
  const dim = daysInMonth(...((() => { const { y, m } = getKSTYMD(first); return [y, m] as const; })()));
  for (let d = 1; d <= dim; d++) {
    days.push(dateFromKSTYMD(getKSTYMD(first).y, getKSTYMD(first).m, d));
  }

  // 뒤쪽(다음 달) 채우기
  const trailing = (7 - (days.length % 7)) % 7;
  if (fill === 'empty') {
    for (let i = 0; i < trailing; i++) days.push(null);
  } else {
    const { y, m } = getKSTYMD(last);
    for (let i = 0; i < trailing; i++) {
      days.push(dateFromKSTYMD(y, m + 1, i + 1));
    }
  }

  return { days };
}

/** DailyCount 배열 → { 'YYYY-MM-DD': count } 맵 (KST 기준) */
export function buildCountMap(rows: DailyCount[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const r of rows ?? []) {
    const key = toKey(parseApiDate(r.date));
    map[key] = (map[key] ?? 0) + r.count;
  }
  return map;
}
