import type { SubmissionApiResponse } from '../types';

const mockSubmissionApiResponse: SubmissionApiResponse = {
  data: {
    pass: {
      count: 5,
      detail: [
        {
          submissionId: 1001,
          language: 'Python3',
          codeLength: '742B',
          submittedAt: '2024-07-22T15:00:00.000Z',
          runtime: 120,
          memory: 15,
          code: `def solution(arr):
    # 퀵 정렬 알고리즘 구현
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return solution(left) + middle + solution(right)

def main():
    n = int(input())
    numbers = list(map(int, input().split()))
    
    sorted_numbers = solution(numbers)
    
    for num in sorted_numbers:
        print(num, end=' ')

if __name__ == "__main__":
    main()`,
          resultText: '맞았습니다!!',
        },
        {
          submissionId: 1002,
          language: 'Java8',
          codeLength: '890B',
          submittedAt: '2024-07-22T16:00:00.000Z',
          runtime: 89,
          memory: 22,
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        
        for(int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        quickSort(arr, 0, n-1);
        
        for(int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
    }
    
    static void quickSort(int[] arr, int low, int high) {
        if(low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi-1);
            quickSort(arr, pi+1, high);
        }
    }
    
    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for(int j = low; j < high; j++) {
            if(arr[j] < pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        swap(arr, i+1, high);
        return i+1;
    }
    
    static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}`,
          resultText: '맞았습니다!!',
        },
        {
          submissionId: 1003,
          language: 'C++17',
          codeLength: '658B',
          submittedAt: '2024-07-22T17:00:00.000Z',
          runtime: 45,
          memory: 8,
          code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    
    while(left <= right) {
        int mid = left + (right - left) / 2;
        
        if(arr[mid] == target) {
            return mid;
        }
        else if(arr[mid] < target) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    return -1;
}

int main() {
    int n, target;
    cin >> n >> target;
    
    vector<int> arr(n);
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    sort(arr.begin(), arr.end());
    
    int result = binarySearch(arr, target);
    cout << result << endl;
    
    return 0;
}`,
          resultText: '맞았습니다!!',
        },
        {
          submissionId: 1004,
          language: 'JavaScript',
          codeLength: '523B',
          submittedAt: '2024-07-22T18:00:00.000Z',
          runtime: 156,
          memory: 28,
          code: `function fibonacci(n) {
    if (n <= 1) return n;
    
    let dp = new Array(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}

function main() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('', (input) => {
        const n = parseInt(input.trim());
        const result = fibonacci(n);
        console.log(result);
        rl.close();
    });
}

main();`,
          resultText: '맞았습니다!!',
        },
        {
          submissionId: 1005,
          language: 'Python3',
          codeLength: '467B',
          submittedAt: '2024-07-22T19:00:00.000Z',
          runtime: 78,
          memory: 12,
          code: `def dfs(graph, start, visited):
    visited[start] = True
    print(start, end=' ')
    
    for neighbor in graph[start]:
        if not visited[neighbor]:
            dfs(graph, neighbor, visited)

def main():
    n, m = map(int, input().split())
    
    graph = [[] for _ in range(n + 1)]
    
    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)
    
    for i in range(1, n + 1):
        graph[i].sort()
    
    visited = [False] * (n + 1)
    start = int(input())
    
    dfs(graph, start, visited)

if __name__ == "__main__":
    main()`,
          resultText: '맞았습니다!!',
        },
      ],
    },
    fail: {
      count: 4,
      detail: [
        {
          submissionId: 2001,
          language: 'Python3',
          codeLength: '445B',
          submittedAt: '2024-07-22T14:10:00.000Z',
          runtime: 0,
          memory: 0,
          code: `def solution(arr):
    # 배열 인덱스 오류가 있는 코드
    result = []
    
    for i in range(len(arr)):
        # 인덱스 범위를 벗어나는 접근
        if arr[i] > arr[i + 1]:  # 여기서 IndexError 발생
            result.append(arr[i])
    
    return result

def main():
    n = int(input())
    numbers = list(map(int, input().split()))
    
    answer = solution(numbers)
    
    for num in answer:
        print(num)

if __name__ == "__main__":
    main()`,
          resultText: '런타임 에러 (ArrayIndexOutOfBounds)',
        },
        {
          submissionId: 2002,
          language: 'Java11',
          codeLength: '567B',
          submittedAt: '2024-07-22T14:40:00.000Z',
          runtime: 234,
          memory: 18,
          code: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] arr = new int[n];
        
        for(int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }
        
        // 잘못된 정렬 알고리즘
        for(int i = 0; i < n; i++) {
            for(int j = 0; j < n-1; j++) {
                // 조건이 잘못됨 (오름차순이어야 하는데 내림차순으로 정렬)
                if(arr[j] < arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = temp;
                }
            }
        }
        
        for(int i = 0; i < n; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}`,
          resultText: '틀렸습니다',
        },
        {
          submissionId: 2003,
          language: 'C++14',
          codeLength: '389B',
          submittedAt: '2024-07-22T15:40:00.000Z',
          runtime: 0,
          memory: 0,
          code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    
    vector<int> arr(n);
    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // 무한 루프 발생
    int i = 0;
    while(i < n) {
        cout << arr[i] << " ";
        // i를 증가시키지 않아서 무한 루프
        if(arr[i] % 2 == 0) {
            continue;
        }
        i++;
    }
    
    return 0;
}`,
          resultText: '시간 초과',
        },
        {
          submissionId: 2004,
          language: 'Python3',
          codeLength: '298B',
          submittedAt: '2024-07-22T16:40:00.000Z',
          runtime: 89,
          memory: 14,
          code: `def main():
    n = int(input())
    
    # 잘못된 계산 로직
    result = 0
    for i in range(1, n):  # n까지가 아닌 n-1까지만 계산
        result += i * 2
    
    # 예상 결과와 다른 값 출력
    print(result + 1)  # +1을 해서 틀린 답 출력

if __name__ == "__main__":
    main()`,
          resultText: '틀렸습니다',
        },
      ],
    },
  },
};

export default mockSubmissionApiResponse;
