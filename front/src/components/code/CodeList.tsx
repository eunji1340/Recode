import type { SubmissionItem } from '../../types';

interface CodeListProps {
  list: SubmissionItem[];
  name: string;
  onCodeSelect: (item: SubmissionItem) => void;
  // 기존에 선택된 코드 아이템을 받기 위해 추가
  selectedCode: SubmissionItem | null; 
}

/**
 * 코드 제출 목록 표시 컴포넌트
 * @param list - 출력할 코드 리스트
 * @param name - 성공/실패 코드 구분 파라미터
 * @param onCodeSelect - 코드 변경 prop 전달받을 인수
 * @param selectedCode - 현재 선택된 코드 아이템 (수정 모드에서 초기값 설정용)
 */
export default function CodeList({ list, name, onCodeSelect, selectedCode }: CodeListProps) {
  return (
    <div className="container w-full">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="w-[15%] py-2 px-4 text-center">선택</th>
            <th className="w-[35%] py-2 px-4 text-center">결과</th>
            <th className="w-[20%] py-2 px-4 text-center">언어</th>
            <th className="w-[15%] py-2 px-4 text-center">길이</th>
            <th className="w-[15%] py-2 px-4 text-center">메모리</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
            <tr 
              key={item.submissionId} 
              className={`submission-card ${selectedCode?.submissionId === item.submissionId ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
            >
              <th className="py-2 px-4 text-center">
                <input
                  type="radio"
                  name={name}
                  id={`code-${item.submissionId}`}
                  onChange={() => onCodeSelect(item)}
                  checked={selectedCode?.submissionId === item.submissionId} // selectedCode와 일치하면 checked
                />
              </th>
              <th className="py-2 px-4 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                {item.resultText}
              </th>
              <th className="py-2 px-4 text-center">{item.language}</th>
              <th className="py-2 px-4 text-center">{item.codeLength}</th>
              <th className="py-2 px-4 text-center">{item.memory}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
