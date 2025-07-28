// 제출 내역 결과 리스트의 인터페이스
export interface List {
  language: string;
  codeLength: string;
  submittedAt: string;
  runtime: number;
  memory: number;
  code: string;
  resultText: string;
}
