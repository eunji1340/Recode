import type { SubmissionItem } from '../../types';

interface CodeListProps {
  list: SubmissionItem[];
  name: string;
  onCodeSelect: (item: SubmissionItem) => void;
}

/**
 * 코드 제출 목록 표시 컴포넌트
 * @param list - 출력할 코드 리스트
 * @param name - 성공/실패 코드 구분 파라미터
 * @param onCodeSelect - 코드 변경 prop 전달받을 인수
 */
export default function CodeList({ list, name, onCodeSelect }: CodeListProps) {
  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>선택</th>
            <th>결과</th>
            <th>언어</th>
            <th>길이</th>
            <th>메모리</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr key={item.submissionId} className="submission-card">
              <th>
                <input
                  type="radio"
                  name={name}
                  id={`code-${item.submissionId}`}
                  onChange={() => onCodeSelect(item)}
                />
              </th>
              <th>{item.resultText}</th>
              <th>{item.language}</th>
              <th>{item.codeLength}</th>
              <th>{item.memory}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
