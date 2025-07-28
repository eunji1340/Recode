import mockList from '../../data/MockSubmitList';
import type { List } from '../../types';

export default function CodeList() {
  return (
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
