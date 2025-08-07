export interface ProblemType {
  id: number;
  title: string;
  level: number;
}

export const mockProblems: ProblemType[] = [
  { id: 1000, title: 'A+B', level: 1 },
  { id: 1001, title: 'A-B', level: 1 },
  { id: 2557, title: 'Hello World', level: 1 },
  { id: 1152, title: '단어의 개수', level: 3 },
  { id: 1924, title: '2007년', level: 4 },
  { id: 10818, title: '최소, 최대', level: 5 },
  { id: 11720, title: '숫자의 합', level: 2 },
  { id: 10951, title: 'A+B - 4', level: 6 },
  { id: 10952, title: 'A+B - 5', level: 6 },
  { id: 2739, title: '구구단', level: 3 },
];
