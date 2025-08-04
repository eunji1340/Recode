import { useParams } from 'react-router-dom';
import type { NoteData } from '../types';
import mockNoteData from '../data/MockNoteData';
import Tag from '../components/tag';
import HeartIcon from '../components/HeartIcon';
import CommentIcon from '../components/CommentIcon';
import { useState } from 'react';
import type { TagProps } from '../components/tag';
import Comment from '../components/Comment';
import MockCommentData from '../data/MockCommentData';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    // TODO: 클라이언트 예외처리 페이지 만들기
    return <div>Invalid note ID</div>;
  }

  const noteId = parseInt(id, 10);
  //   TODO: 실제 API로 대체
  const noteItem = mockNoteData.find((note) => note.data.noteId === noteId);

  //   noteItem 예외처리
  if (!noteItem) {
    throw new Error('noteItem not found');
  }

  const data: NoteData = noteItem.data;

  // 좋아요 & 댓글 상태 관리 / TODO: 좋아요 mock data와 연결
  const mockLikeandCount = {
    liked: false,
    likes: 6,
    comments: 8,
  };

  const [liked, setLiked] = useState(mockLikeandCount.liked);
  const [likes, setLikes] = useState(mockLikeandCount.likes);

  const handleHeartClick = function () {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => prev + (nextLiked ? 1 : -1));
    // TODO: 좋아요 API 호출
  };

  //   TODO: Tag API 호출
  const TagData: TagProps[] = [
    {
      name: 'BFS',
    },
    {
      name: 'DFS',
    },
    {
      name: '백트래킹',
    },
  ];

  //   TOOD: 댓글 API 호출
  const comment = MockCommentData;

  return (
    <div className="flex flex-col justify-center items-start p-6 gap-6">
      {/* 검색창 */}

      {/* 배경 카드 */}
      <div className="w-full bg-white rounded-xl shadow px-5 py-4 space-y-2 text-[#0B0829]">
        {/* 노트 정보 */}
        <div className="note-container">
          {/* 노트 제목 & 사용자명 */}
          <div className="container flex flex-row justify-between">
            {/* 노트 제목 */}
            <div className="text-2xl font-bold">{data.noteTitle}</div>
            {/* 사용자 */}
            {/* TODO: 사용자 id 기반으로 사용자명 받아오기 */}
            <div className="user-container">
              사용자명 받아오기: {data.userId}
              <button>팔로우 버튼</button>
            </div>
          </div>
          <hr className="my-3 border-t-2 border-gray-300" />{' '}
          <div className="text-xl font-bold">
            {data.problemId + ' ' + data.problemName}
          </div>
          {/* 노트 본문 */}
          <div>
            <div className="text-lg font-bold my-3">코드</div>
            <hr className="my-3 border-t-2 border-gray-300" />{' '}
            {/* TODO: front merge 후 라이브러리 작성 */}
            <div className="flex flex-row justify-around">
              <div>
                <div className="text-sm font-bold">성공 코드</div>
                {data.successCode}
              </div>
              <div>
                <div className="text-sm font-bold">실패 코드</div>
                {data.failCode}
              </div>
            </div>
            <div className="content">
              <div className="text-lg font-bold my-3">본문</div>
              <hr className="my-3 border-t-2 border-gray-300" />
              <div>{data.content}</div>
            </div>
            <div>
              <hr className="my-3 border-t-2 border-gray-300" />
              <div className="flex flex-row justify-between">
                <div className="tags">
                  {TagData.map((tag, index) => (
                    <Tag key={index} name={tag.name}></Tag>
                  ))}
                </div>
                <div className="likes-and-comments flex flex-row">
                  <div>
                    <HeartIcon
                      liked={liked}
                      likes={likes}
                      onClick={handleHeartClick}
                    ></HeartIcon>
                  </div>
                  <div>
                    <CommentIcon
                      commentCount={mockLikeandCount.comments}
                    ></CommentIcon>
                  </div>
                </div>
              </div>
              {/* TODO: 작성자 본인 아니면 숨기기 */}
              <div className="flex gap-2 mt-4">
                <button className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                  수정
                </button>
                <button className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                  삭제
                </button>
              </div>
            </div>
          </div>
          <hr className="my-3 border-t-2 border-gray-300" />
          {/* 댓글 */}
          <div className="comment-container">
            {/* TODO: 댓글 API 연결 */}
            <div className="text-lg font-bold my-3">댓글 보기</div>
            <div>
              {comment.map((item) => (
                <Comment
                  key={item.commentId}
                  noteId={item.noteId}
                  content={item.content}
                  createdAt={item.createdAt}
                  userId={item.userId}
                ></Comment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
