import { useEffect, useRef, useState, useCallback } from 'react';

type InfiniteParams = { page: number; size: number } & Record<string, any>;

/**
 * 무한 스크롤 기반 피드 로드 훅
 *
 * @param fetchFn       데이터 패칭 함수
 * @param searchParams  검색/필터 파라미터
 * @param pageSize      페이지 당 아이템 수
 * @param resetKey      강제 첫 페이지 재로드 트리거
 */
export function useInfiniteFeeds<T>(
  fetchFn: (params: InfiniteParams) => Promise<{ items: T[]; last: boolean }>,
  searchParams: Record<string, any>,
  pageSize = 10,
  resetKey = 0
) {
  const [dataList, setDataList] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  /** 특정 페이지 로드 */
  const loadPage = useCallback(
    async (targetPage: number) => {
      // 로딩 중이거나 마지막 페이지면 더 불러오지 않음 (단, 0페이지는 예외)
      if (isLoading || (isLastPage && targetPage !== 0)) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetchFn({
          page: targetPage,
          size: pageSize,
          ...searchParams,
        });

        if (targetPage === 0) {
          setDataList(res.items);
        } else {
          setDataList((prev) => {
            const existingIds = new Set((prev as any[]).map((item) => item.noteId));
            const newItems = res.items.filter(
              (item: any) => !existingIds.has(item.noteId)
            );
            return [...prev, ...newItems];
          });
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
    [fetchFn, pageSize, searchParams, isLoading, isLastPage]
  );

  /** 옵저버 연결 */
  const attachObserver = useCallback(() => {
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    observerInstance.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading && !isLastPage) {
        loadPage(page);
      }
    });

    if (observerRef.current) {
      observerInstance.current.observe(observerRef.current);
    }
  }, [page, loadPage, isLoading, isLastPage]);

  /** 검색 조건이나 resetKey 변경 시 첫 페이지부터 재로드 */
  useEffect(() => {
    if (observerInstance.current) observerInstance.current.disconnect();
    setPage(0);
    setIsLastPage(false);
    setDataList([]);

    // 첫 페이지 로드 후 옵저버 연결
    loadPage(0).then(() => {
      attachObserver();
    });
  }, [JSON.stringify(searchParams), resetKey]);

  /** 최초 마운트 시 옵저버 연결 */
  useEffect(() => {
    attachObserver();
    return () => {
      if (observerInstance.current) observerInstance.current.disconnect();
    };
  }, [attachObserver]);

  /** 특정 유저 팔로우 상태 업데이트 */
  const updateFollowState = (targetUserId: number, following: boolean) => {
    setDataList((prev) =>
      prev.map((item: any) =>
        item.user?.userId === targetUserId ? { ...item, following } : item
      )
    );
  };

  /** 외부에서 호출할 수 있는 reset/retry */
  const reset = () => {
    setPage(0);
    setIsLastPage(false);
    setDataList([]);
    loadPage(0);
  };

  const retry = () => {
    setError(null);
    loadPage(0);
  };

  return {
    dataList,
    isLoading,
    error,
    observerRef,
    reset,
    retry,
    updateFollowState,
  };
}