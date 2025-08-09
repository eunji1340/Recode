import { useParams } from 'react-router-dom';
import Tag from '../components/common/Tag';
import HeartIcon from '../components/common/HeartIcon';
import { useEffect, useState } from 'react';
import type { NoteDetailResponseDTO } from '../types/NoteDetail';
import api from '../api/axiosInstance';
import CodePreview from '../components/code/CodePreview';
import ProblemTitle from '../components/feed/ProblemTitle';
import FollowButton from '../components/common/FollowButton';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {
  CommentApiResponse,
  CommentResponseDTO,
  User,
} from '../types/comment';
import CommentIcon from '../components/common/CommentIcon';
import Comment from '../components/note/Comment';
import { useUserStore } from '../stores/userStore';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [note, setNote] = useState<NoteDetailResponseDTO | null>(null);
  //   새로 작성하는 댓글
  const [commentText, setCommentText] = useState('');
  //    기존 작성된 댓글
  const [comments, setComments] = useState<CommentApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [writer, setWriter] = useState<User>(); // note 작성한 user
  const [isSuccessCodeExpanded, setIsSuccessCodeExpanded] = useState(false);
  const [isFailCodeExpanded, setIsFailCodeExpanded] = useState(false);

  const { userId } = useUserStore();
  const loginUserId = parseInt(userId ?? '0', 10);

  if (!id) {
    return <div>Invalid note ID</div>;
  }

  const noteId = parseInt(id, 10); // 10진수 정수로 parse

  const fetchComments = async () => {
    try {
      const commentResponse = await api.get<CommentApiResponse>(
        `/feeds/${noteId}/comments`,
      );
      setComments(commentResponse.data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const noteResponse = await api.get<NoteDetailResponseDTO>(
        `/notes/${noteId}`,
      );
      setNote(noteResponse.data);
      console.log(noteResponse.data);
      setError(null);
      setWriter(noteResponse.data.user);
    } catch (err) {
      console.log(err);
      setError('노트를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [noteId]); // noteId가 변경될 때만 실행

  const handleLikeToggle = async () => {
    if (!note) return;

    // 좋아요 UI: API 호출 전 미리 변경 (optimistic update)
    const originalNote = note;
    const newLikedStatus = !note.liked;
    const newLikeCount = note.liked ? note.likeCount - 1 : note.likeCount + 1;

    setNote({
      ...note,
      liked: newLikedStatus,
      likeCount: newLikeCount,
    });

    try {
      if (newLikedStatus) {
        await api.post(`/feeds/${noteId}/hearts`);
      } else {
        await api.delete(`/feeds/${noteId}/hearts`);
      }
    } catch (err) {
      console.error('Failed to update like status:', err);
      setNote(originalNote);
      // TODO: 사용자에게 에러 알림 (예: toast message)
    }
  };

  //   댓글 작성 API
  const handleWriteComment = async () => {
    if (!commentText.trim()) return; // 빈 댓글 방지

    const commentRequest = {
      content: commentText,
    };

    try {
      await api.post(`/feeds/${noteId}/comments`, commentRequest);
      setCommentText('');
      fetchComments(); // 댓글 목록 새로고침
    } catch (err) {
      console.log('Failed to write comment:', err);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!note) {
    return <div>노트 데이터를 찾을 수 없습니다.</div>;
  }

  // timestamp Date String으로 변환
  const date = new Date(note.createdAt).toLocaleDateString('ko-KR');
  const image = '';

  return (
    <div className="flex flex-col justify-center items-start p-6 gap-6">
      <div className="w-full bg-white rounded-xl shadow px-5 py-4 space-y-2 text-[#0B0829]">
        {/* 노트 정보 */}
        <div className="note-container">
          <div className="container flex flex-row justify-between">
            <div className="text-2xl font-bold">
              <div>{note.noteTitle}</div>
              <div className="text-sm font-bold">작성일: {date} </div>
            </div>

            <div className="flex items-center gap-2">
              {image ? (
                <img
                  src={image}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#A0BACC] flex items-center justify-center text-white font-bold">
                  {note.user.nickname[0]}
                </div>
              )}
              <div className="text-base font-semibold">
                {note.user.nickname}
              </div>
              <FollowButton
                isFollowing={true}
                onToggle={() => {}}
              ></FollowButton>
            </div>
          </div>
          <hr className="my-3 border-t-2 border-gray-300" />
          <div className="text-xl font-bold">
            <ProblemTitle
              problemId={note.problem.problemId}
              problemName={note.problem.problemName}
              problemTier={note.problem.problemTier}
              fontSize="text-xl"
            ></ProblemTitle>
          </div>
          <div>
            <div className="text-lg font-bold my-3">코드</div>
            <hr className="my-3 border-t-2 border-gray-300" />
            <div className="flex flex-row justify-around gap-4">
              <div className="w-1/2">
                <div className="text-sm font-bold">성공 코드</div>
                <div
                  className={`relative transition-all duration-300 ease-in-out overflow-hidden ${
                    isSuccessCodeExpanded ? 'max-h-[1000px]' : 'max-h-40'
                  }`}
                >
                  <pre>
                    <CodePreview
                      code={note.successCode}
                      language={note.successLanguage}
                    ></CodePreview>
                  </pre>
                  {!isSuccessCodeExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent"></div>
                  )}
                </div>
                <button
                  onClick={() =>
                    setIsSuccessCodeExpanded(!isSuccessCodeExpanded)
                  }
                  className="text-sm text-blue-500 hover:underline mt-1"
                >
                  {isSuccessCodeExpanded ? '접기' : '더 보기'}
                </button>
              </div>
              <div className="w-1/2">
                <div className="text-sm font-bold">실패 코드</div>
                <div
                  className={`relative transition-all duration-300 ease-in-out overflow-hidden ${
                    isFailCodeExpanded ? 'max-h-[1000px]' : 'max-h-40'
                  }`}
                >
                  <pre>
                    <CodePreview
                      code={note.failCode}
                      language={note.failLanguage}
                    ></CodePreview>
                  </pre>
                  {!isFailCodeExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent"></div>
                  )}
                </div>
                <button
                  onClick={() => setIsFailCodeExpanded(!isFailCodeExpanded)}
                  className="text-sm text-blue-500 hover:underline mt-1"
                >
                  {isFailCodeExpanded ? '접기' : '더 보기'}
                </button>
              </div>
            </div>
            <div className="content">
              <div className="text-lg font-bold my-3">본문</div>
              <hr className="my-3 border-t-2 border-gray-300" />
              <div className="prose max-w-none p-4">
                <Markdown remarkPlugins={[remarkGfm]}>{note.content}</Markdown>
              </div>
            </div>
            <div>
              <hr className="my-3 border-t-2 border-gray-300" />
              <div className="flex flex-row justify-between">
                <div className="tags">
                  {note.tags.map((tag) => (
                    <Tag key={tag.tagId} tagName={tag.tagName}></Tag>
                  ))}
                </div>
                <div className="likes-and-comments flex flex-row">
                  <div>
                    <HeartIcon
                      liked={note.liked}
                      likeCount={note.likeCount}
                      onClick={handleLikeToggle}
                    ></HeartIcon>
                  </div>
                  <div>
                    <CommentIcon
                      count={comments?.details ? comments.details.length : 0}
                    ></CommentIcon>
                  </div>
                </div>
              </div>

              {/* 작성자 본인일때만 버튼 보여주기 */}
              {writer?.userId === loginUserId ? (
                <div className="flex gap-2 mt-4">
                  <button className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    수정
                  </button>
                  <button className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    삭제
                  </button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
          <hr className="my-3 border-t-2 border-gray-300" />
          {/* 댓글 */}
          <div className="comment-container mt-6">
            <div className="w-full mb-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out resize-none"
                name="comment-create"
                id="comment-create"
                rows={3}
                placeholder="댓글을 입력하세요..."
                value={commentText}
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
              {comments && comments.details.length > 0 ? (
                comments.details.map((item: CommentResponseDTO) => (
                  <Comment
                    user={item.user}
                    commentId={item.commentId}
                    content={item.content}
                    createdAt={item.createdAt}
                    noteId={note.noteId}
                    key={item.commentId}
                    onCommentChange={fetchComments} // 댓글 변경 시 새로고침
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

