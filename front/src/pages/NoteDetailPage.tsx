import mockNoteData from '../data/MockNoteData';
import type { NoteData } from '../types';
import Tag from '../components/tag';

export default function NoteDetailPage() {
  const data: NoteData = mockNoteData.data;
  console.log(data);

  return (
    <div className="flex flex-col justify-center items-start p-6 gap-6">
      {/* 검색창 */}

      {/* 배경 카드 */}
      <div className="w-full bg-white rounded-xl shadow px-5 py-4 space-y-2 text-[#0B0829]">
        {/* 노트 정보 */}
        <div className="note-container">
          <div>노트 제목: {data.noteTitle}</div>
          <div>사용자명: {data.userId}</div>
          <div>팔로우 버튼</div>
          <hr className="my-6 border-t-2 border-gray-300" />{' '}
          <div>문제 정보: {data.problemName}</div>
          {/* 노트 본문 */}
          <div>
            <h2>코드</h2>
            {/* TODO: front merge 후 라이브러리 작성 */}
            <div className="flex flex-row">
              <div>성공 코드: {data.successCode}</div>
              <div>실패 코드: {data.failCode}</div>
            </div>
            <div>
              여기 마크다운 콘텔츠 들어올꺼올 문제 해석 풀이 전략 한줄 회고
              <div>{data.content}</div>
            </div>
            <div>
              <div>
                태그 목록
                <Tag name="test1"></Tag>
                <Tag name="test2"></Tag>
              </div>
              {/* TODO: 하트 & 댓글 공통 컴포넌트 분리 */}
              <div>좋아요 댓글 갯수</div>
              {/* TODO: 본인 아니면 숨기기 */}
              <div>
                <button>수정</button>
                <button>삭제</button>
              </div>
            </div>
          </div>
          {/* 댓글 */}
          <div>댓글 보기</div>
        </div>
      </div>
    </div>
  );
}
