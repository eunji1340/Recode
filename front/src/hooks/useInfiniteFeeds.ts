import { useEffect, useRef, useState, useCallback } from 'react';

type InfiniteParams = { page: number; size: number } & Record<string, any>;

/**
 * 무한 스크롤 기반 피드 로드 훅 (중복 호출 방지 개선 버전)
 */
export function useInfiniteFeeds<T>(
  fetchFn: (params: InfiniteParams) => Promise<{ items: T[]; last: boolean }>,
  searchParams: Record<string, any>,
  pageSize = 10,
  resetKey = 0,
  enabled = true,
) {
  const [dataList, setDataList] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ref로 상태를 관리하여 클로저 문제 해결
  const stateRef = useRef({
    isLoading: false,
    isLastPage: false,
    currentPage: 0,
    isInitialized: false,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<boolean>(false); // 중복 호출 방지를 위한 추가 플래그

  /**
   * 페이지 로드 함수 - useCallback 의존성 최소화
   */
  const loadPage = useCallback(
    async (targetPage: number, isReset = false) => {
      if (!enabled) return;

      // 중복 호출 방지
      if (loadingRef.current) {
        console.log('이미 로딩 중입니다. 중복 호출 방지');
        return;
      }

      // 마지막 페이지인데 추가 로드 시도하는 경우 방지
      if (!isReset && targetPage > 0 && stateRef.current.isLastPage) {
        console.log('마지막 페이지입니다. 추가 로드 중단');
        return;
      }

      loadingRef.current = true;
      stateRef.current.isLoading = true;
      setIsLoading(true);
      setError(null);

      try {
        console.log(`페이지 ${targetPage} 로딩 시작`);

        const res = await fetchFn({
          page: targetPage,
          size: pageSize,
          ...searchParams,
        });

        // 첫 페이지이고 데이터가 없는 경우
        if (targetPage === 0 && res.items.length === 0) {
          setDataList([]);
          setIsLastPage(true);
          stateRef.current.isLastPage = true;
          stateRef.current.currentPage = 0;
          return;
        }

        // 데이터 업데이트
        if (targetPage === 0 || isReset) {
          // 첫 페이지 또는 리셋인 경우
          setDataList(res.items);
        } else {
          // 다음 페이지 추가
          setDataList((prev) => {
            const existingIds = new Set(
              (prev as any[]).map((item) => item.noteId || item.id),
            );
            const newItems = res.items.filter(
              (item: any) => !existingIds.has(item.noteId || item.id),
            );
            return [...prev, ...newItems];
          });
        }

        // 상태 업데이트
        const newPage = targetPage + 1;
        setPage(newPage);
        setIsLastPage(res.last);

        stateRef.current.currentPage = newPage;
        stateRef.current.isLastPage = res.last;
        stateRef.current.isInitialized = true;

        console.log(
          `페이지 ${targetPage} 로딩 완료. 다음 페이지: ${newPage}, 마지막: ${res.last}`,
        );
      } catch (e) {
        console.error('피드 로딩 실패:', e);
        setError(
          e instanceof Error ? e.message : '데이터를 불러오는데 실패했습니다.',
        );
      } finally {
        loadingRef.current = false;
        stateRef.current.isLoading = false;
        setIsLoading(false);
      }
    },
    [enabled, fetchFn, pageSize, JSON.stringify(searchParams)],
  );

  /**
   * Intersection Observer 콜백 - 의존성 없는 함수로 분리
   */
  const handleIntersection = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (!entry.isIntersecting) return;
      if (!enabled) return;

      // ref 값으로 체크하여 클로저 문제 해결
      if (stateRef.current.isLoading || stateRef.current.isLastPage) {
        return;
      }

      console.log(
        '교차점 감지, 다음 페이지 로드:',
        stateRef.current.currentPage,
      );
      loadPage(stateRef.current.currentPage);
    },
    [enabled, loadPage],
  );

  /**
   * Observer 설정
   */
  const setupObserver = useCallback(() => {
    if (!enabled) return;

    // 기존 observer 정리
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    // 새 observer 생성
    observerInstance.current = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px', // 100px 전에 미리 로드
      threshold: 0.1,
    });

    // 타겟 요소가 있으면 관찰 시작
    if (observerRef.current) {
      observerInstance.current.observe(observerRef.current);
    }
  }, [enabled, handleIntersection]);

  /**
   * 초기화 및 검색 조건 변경 시 처리
   */
  useEffect(() => {
    if (!enabled) {
      // enabled가 false면 모든 상태 리셋
      setDataList([]);
      setPage(0);
      setIsLastPage(false);
      setError(null);
      stateRef.current = {
        isLoading: false,
        isLastPage: false,
        currentPage: 0,
        isInitialized: false,
      };
      return;
    }

    console.log('검색 조건 변경 또는 초기화');

    // Observer 정리
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    // 상태 리셋
    setPage(0);
    setIsLastPage(false);
    setError(null);
    stateRef.current = {
      isLoading: false,
      isLastPage: false,
      currentPage: 0,
      isInitialized: false,
    };

    // 첫 페이지 로드 후 Observer 설정
    const initializeData = async () => {
      await loadPage(0, true);
      setupObserver();
    };

    initializeData();
  }, [enabled, JSON.stringify(searchParams), resetKey]);

  /**
   * Observer 설정 (의존성 변경 시)
   */
  useEffect(() => {
    if (!enabled || !stateRef.current.isInitialized) return;

    setupObserver();

    return () => {
      if (observerInstance.current) {
        observerInstance.current.disconnect();
      }
    };
  }, [setupObserver]);

  /**
   * 팔로우 상태 업데이트
   */
  const updateFollowState = useCallback(
    (targetUserId: number, following: boolean) => {
      setDataList((prev) =>
        prev.map((item: any) =>
          item.user?.userId === targetUserId ? { ...item, following } : item,
        ),
      );
    },
    [],
  );

  /**
   * 리셋 함수
   */
  const reset = useCallback(() => {
    if (!enabled) return;

    console.log('수동 리셋 실행');

    // Observer 정리
    if (observerInstance.current) {
      observerInstance.current.disconnect();
    }

    // 상태 리셋
    setDataList([]);
    setPage(0);
    setIsLastPage(false);
    setError(null);
    stateRef.current = {
      isLoading: false,
      isLastPage: false,
      currentPage: 0,
      isInitialized: false,
    };

    // 첫 페이지 로드 후 Observer 설정
    const resetData = async () => {
      await loadPage(0, true);
      setupObserver();
    };

    resetData();
  }, [enabled, loadPage, setupObserver]);

  /**
   * 재시도 함수
   */
  const retry = useCallback(() => {
    if (!enabled) return;

    setError(null);
    loadPage(stateRef.current.currentPage - 1 || 0);
  }, [enabled, loadPage]);

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
