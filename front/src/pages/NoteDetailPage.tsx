import { useParams } from 'react-router-dom';
import Tag from '../components/tag';
import HeartIcon from '../components/HeartIcon';
import CommentIcon from '../components/CommentIcon';
import { useEffect, useState } from 'react';
import Comment from '../components/Comment';
import type { NoteDetail, NoteDetailResponse } from '../types/NoteDetail';
import type { CommentResponse } from '@/types/comment';
import api from '../api/axiosInstance';
import CodePreview from '../components/code/CodePreview';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [note, setNote] = useState<NoteDetail | null>(null);
  //   새로 작성하는 댓글
  const [commentText, setCommentText] = useState('');
  //    기존 작성된 댓글
  const [comments, setComments] = useState<CommentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!id) {
    return <div>Invalid note ID</div>;
  }

  const noteId = parseInt(id, 10); // 10진수 정수로 parse

  const fetchComments = async () => {
    try {
      setLoading(true);

      const commentResponse = await api.get<CommentResponse>(
        `/feeds/${noteId}/comments`,
      );
      setComments(commentResponse.data);
      setError(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const noteResponse = await api.get<NoteDetailResponse>(
        `/notes/${noteId}`,
      );
      setNote(noteResponse.data);
      setError(null);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [noteId]); // noteId가 변경될 때만 실행

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  //   TODO: 클라이언트 에러 페이지 만들기
  if (!note) {
    return <div>노트 데이터를 찾을 수 없습니다.</div>;
  }

  // TODO: token decoding
  //   const isWriter: boolean = note.user.userId ===   ? true : false;

  // timestamp Date String으로 변환
  const date = new Date(note.createdAt).toLocaleDateString('ko-KR');

  const handleHeartClick = async () => {
    try {
      const resp = await api.post(`/feeds/${noteId}/hearts`);
      console.log('좋아요 성공', resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  //   댓글 작성 API
  const handleWriteComment = async () => {
    const commentData = {
      content: commentText,
    };

    try {
      const resp = await api.post(`/feeds/${noteId}/comments`, commentData);
      console.log('댓글 작성 성공', resp.data);
      setCommentText('');
      fetchComments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-start p-6 gap-6">
      <div className="w-full bg-white rounded-xl shadow px-5 py-4 space-y-2 text-[#0B0829]">
        {/* 노트 정보 */}
        <div className="note-container">
          <div className="container flex flex-row justify-between">
            <div className="text-2xl font-bold">
              <div>{note.noteTitle}</div>
              <div className="text-sm font-bold">생성일: {date} </div>
            </div>
            <div className="user-container">
              <div>{note.user.nickname}</div>
              {/* TODO: 팔로우 버튼 컴포넌트 분리 */}
              <button>팔로우</button>
            </div>
          </div>
          <hr className="my-3 border-t-2 border-gray-300" />
          <div className="text-xl font-bold">
            {/* TODO: problemTier 정적 콘텐츠로 변환 */}
            {note.problem.problemTier +
              ' ' +
              note.problem.problemId +
              ' ' +
              note.problem.problemName}
          </div>
          <div>
            <div className="text-lg font-bold my-3">코드</div>
            <hr className="my-3 border-t-2 border-gray-300" />
            <div className="flex flex-row justify-around">
              {/* TODO: 코드 접기 추가 & 스타일 변경 */}
              <div>
                <div className="text-sm font-bold">성공 코드</div>
                <pre>
                  <CodePreview
                    code={note.successCode}
                    language={note.successLanguage}
                  ></CodePreview>
                </pre>
              </div>
              <div>
                <div className="text-sm font-bold">실패 코드</div>
                <pre>
                  <CodePreview
                    code={note.failCode}
                    language={note.failLanguage}
                  ></CodePreview>
                </pre>
              </div>
            </div>
            <div className="content">
              <div className="text-lg font-bold my-3">본문</div>
              <hr className="my-3 border-t-2 border-gray-300" />
              <div>{note.content}</div>
            </div>
            <div>
              <hr className="my-3 border-t-2 border-gray-300" />
              <div className="flex flex-row justify-between">
                <div className="tags">
                  {note.tags.map((name, index) => (
                    <Tag key={index} name={name}></Tag>
                  ))}
                </div>
                <div className="likes-and-comments flex flex-row">
                  <div>
                    {/* TODO: user 본인의 게시글 별 like 여부 확인 */}
                    <HeartIcon
                      //   liked={liked}
                      likes={note.likeCount}
                      onClick={handleHeartClick}
                    ></HeartIcon>
                  </div>
                  <div>
                    <CommentIcon
                      commentCount={comments?.details.length ?? 0}
                    ></CommentIcon>
                  </div>
                </div>
              </div>
              {/* TODO: 작성자일때만 보기로 대체 */}
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
          <div className="comment-container mt-6">
            <div className="w-full mb-4">
              {/* TODO: 댓글 삭제 및 수정 API 연동 */}
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out resize-none"
                name="comment-create"
                id="comment-create"
                rows={3}
                placeholder="댓글을 입력하세요..."
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  onClick={handleWriteComment}
                >
                  댓글 등록
                </button>
              </div>
            </div>
            <div className="text-lg font-bold my-3">댓글</div>
            <div>
              {comments && comments.details && comments.details.length > 0 ? (
                comments.details.map((item) => (
                  <Comment
                    key={item.commentId}
                    noteId={item.noteId}
                    content={item.content}
                    createdAt={item.createdAt}
                    nickname={item.user.nickname}
                    commentId={item.commentId}
                    onCommentDeleted={fetchComments}
                  ></Comment>
                ))
              ) : (
                <div>작성된 댓글이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
