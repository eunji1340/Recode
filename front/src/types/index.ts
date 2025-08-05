// 제출 내역 결과 리스트의 인터페이스
export interface SubmissionItem {
  submissionId: number;
  language: string;
  codeLength: string;
  submittedAt: string;
  runtime: number;
  memory: number;
  code: string;
  resultText: string;
}

// submissionData 추가
export interface SubmissionData {
  count: number;
  detail: SubmissionItem[];
}

export interface SubmissionApiResponse {
  data: {
    pass: SubmissionData;
    fail: SubmissionData;
  };
}
