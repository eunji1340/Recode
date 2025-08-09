import { useEffect, useRef, useState } from 'react';

type InfiniteParams = { page: number; size: number } & Record<string, any>;

/**
 * Feed(노트) 목록을 무한스크롤 방식으로 불러오는 공통 훅
 *
 * @param fetchFn - 데이터 패칭 함수 (페이지네이션 + 기타 파라미터 포함)
 * @param searchParams - 검색 조건 (search, tag, sort 등)
 * @param pageSize - 한 페이지당 불러올 항목 수 (기본값 10)
 */
export function useInfiniteFeeds<T>(
  fetchFn: (params: InfiniteParams) => Promise<{ items: T[]; last: boolean }>,
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
        const existingIds = new Set(dataList.map((item: any) => item.noteId));
        const newItems = res.items.filter((item: any) => !existingIds.has(item.noteId));
        setDataList((prev) => [...prev, ...newItems]);
      }
      setIsLastPage(res.last);
      setPage(targetPage + 1);
    } catch (e) {
      console.error('피드 로딩 실패:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPage(0);
  }, [JSON.stringify(searchParams)]);

  useEffect(() => {
    if (isLastPage || isLoading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadPage(page);
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