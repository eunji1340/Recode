export interface AiNote {
  title: string;
  content: string;
}

const mockAiNote: AiNote = {
  title: '시간 초과 해결을 위한 알고리즘 최적화 분석',
  content: `## 문제 분석: 시간 복잡도

두 코드를 비교한 결과, 실패한 코드는 **이중 반복문**을 사용하여 시간 복잡도가 O(N^2)에 달하는 반면, 성공한 코드는 **해시 맵(Hash Map)**을 활용하여 시간 복잡도를 O(N)으로 크게 개선했습니다.

### 주요 변경 사항

- **자료 구조:** 배열을 사용한 순차 탐색에서 해시 맵을 이용한 키-값 탐색으로 변경.
- **알고리즘:** 불필요한 내부 반복을 제거하고, 각 요소를 한 번만 순회하는 방식으로 최적화.

## 결론

시간 초과 문제는 대부분 비효율적인 알고리즘으로 인해 발생합니다. 문제의 제약 ���건을 확인하고, 적절한 자료 구조를 선택하여 시간 복잡도를 줄이는 것이 중요합니다. 이 경우, 해시 맵 사용이 핵심적인 해결책이었습니다.
`,
};

// 실제 API 호출을 흉내 내는 비동기 함수
export const fetchMockAiNote = (): Promise<AiNote> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAiNote);
    }, 1500); // 1.5초 지연
  });
};
