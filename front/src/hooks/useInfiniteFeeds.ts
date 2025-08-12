import { useEffect, useRef, useState, useCallback } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  /**
   * 특정 페이지의 데이터를 로드하는 함수
   */
  const loadPage = useCallback(
    async (targetPage: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetchFn({ page: targetPage, size: pageSize, ...searchParams });

        if (targetPage === 0) {
          setDataList(res.items);
        } else {
          const existingIds = new Set((dataList as any[]).map((item) => item.noteId));
          const newItems = res.items.filter((item: any) => !existingIds.has(item.noteId));
          setDataList((prev) => [...prev, ...newItems]);
        }

        setIsLastPage(res.last);
        setPage(targetPage + 1);
      } catch (e) {
        console.error('피드 로딩 실패:', e);
        setError(e instanceof Error ? e.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, pageSize, searchParams, dataList]
  );

  /**
   * 옵저버 연결
   */
  const attachObserver = useCallback(() => {
    if (isLastPage || isLoading || error) return;

    // 기존 옵저버 정리
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    observerInstance.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadPage(page);
      }
    });

    const el = observerRef.current;
    if (el) observerInstance.current.observe(el);
  }, [isLastPage, isLoading, error, page, loadPage]);

  /**
   * 에러 상태 초기화 후 첫 페이지 로드
   */
  const retry = () => {
    setError(null);
    loadPage(0);
  };

  /**
   * searchParams 변경 시 첫 페이지부터 로드 + 옵저버 재연결
   */
  useEffect(() => {
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }
    setPage(0);
    setIsLastPage(false);
    setDataList([]);
    loadPage(0).then(() => {
      attachObserver();
    });
  }, [JSON.stringify(searchParams)]);

  /**
   * 최초 마운트 시 옵저버 연결
   */
  useEffect(() => {
    attachObserver();
    return () => {
      if (observerInstance.current) observerInstance.current.disconnect();
    };
  }, [attachObserver]);

  /** 특정 유저의 팔로우 상태를 전체 목록에서 즉시 반영 */
  const updateFollowState = (targetUserId: number, following: boolean) => {
    setDataList((prev) =>
      prev.map((item: any) =>
        item.user?.userId === targetUserId
          ? { ...item, following }
          : item
      )
    );
  };

  return {
    dataList,
    isLoading,
    error,
    observerRef,
    reset: () => loadPage(0),
    retry,
    updateFollowState,
  };
}
