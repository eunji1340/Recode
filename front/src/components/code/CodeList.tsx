import type { SubmissionItem } from '../../types';
import mockList from '../../data/MockSubmitList';

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
    <div className="submission-container">
      {/* success, failure 필터링 후 가져와보기 */}
      <div className="submission-list">
        <h3>결과</h3>
        {/* item 기준으로 jsx 문법 사용 */}
        {mockList.map((item: List, index: number) => (
          <div key={index} className="submission-card">
            <div>결과: {item.resultText}</div>
            <div>언어: {item.language}</div>
            <div>길이: {item.codeLength}</div>
            <div>메모리: {item.memory}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
