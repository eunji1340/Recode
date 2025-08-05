// import { useParams } from 'react-router-dom';
import type { CommentData } from '../types';

export default function Comment({
  profilePic,
  content,
  nickname,
  createdAt,
}: CommentData) {
  // timestamp Date String으로 변환
  const date = new Date(createdAt).toLocaleDateString('ko-KR');

  return (
    <div className="comment-container flex flex-row justify-between">
      <div>사진{profilePic}</div>
      <div>
        <div>{nickname}</div>
        <div className="text-md font-bold my-3 text-left">{content} </div>
      </div>
      <div>
        {/* TODO: 본인 아니면 숨기기 & 버튼 컴포넌트 분리*/}
        <div className="flex gap-2 mt-4">
          <button className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            수정
          </button>
          <button className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            삭제
          </button>
        </div>
        <div>생성일: {date} </div>
      </div>
    </div>
  );
}
