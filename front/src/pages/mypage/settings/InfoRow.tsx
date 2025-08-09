import React from 'react';

/** 라벨-값 및 액션 버튼 한 줄 출력용 */
interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode; // 오른쪽에 추가될 버튼 등의 요소
}

export default function InfoRow({ label, value, action }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="w-28 flex-shrink-0 text-sm font-medium text-zinc-600">
          {label}
        </div>
        <div className="flex-1 text-sm text-zinc-800">{value}</div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
