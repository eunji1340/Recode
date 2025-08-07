import { useEffect, useRef, useState } from 'react';

/**
 * Feed(노트) 목록을 무한스크롤 방식으로 불러오는 공통 훅
 */
export function useInfiniteFeeds<T>(
  fetchFn: (params: { page: number; size: number } & Record<string, any>) => Promise<{ items: T[]; last: boolean }>,
  searchParams: Record<string, any>,
  pageSize = 10
) {
  const [dataList, setDataList] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadPage = async (targetPage: number) => {
    setIsLoading(true);
    try {
      const res = await fetchFn({ page: targetPage, size: pageSize, ...searchParams });
      if (targetPage === 0) {
        setDataList(res.items);
      } else {
        setDataList((prev) => {
          const existingIds = new Set((prev as any[]).map((item) => item.noteId));
          const newItems = res.items.filter((item: any) => !existingIds.has(item.noteId));
          return [...prev, ...newItems];
        });
      }
      setIsLastPage(res.last);
      setPage(targetPage + 1);
    } catch (e) {
      console.error('피드 로딩 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  /** 검색 조건 바뀔 때 초기화 */
  useEffect(() => {
    loadPage(0); // 초기화 + 첫 페이지 로딩
  }, [JSON.stringify(searchParams)]);

  /** 스크롤 마지막 요소 감지 */
  useEffect(() => {
    if (isLastPage || isLoading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadPage(page); // 현재 page 기준
      }
    });

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [observerRef.current, page, isLastPage, isLoading]);

  return {
    dataList,
    isLoading,
    observerRef,
    reset: () => loadPage(0),
  };
}
