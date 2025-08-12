import { useParams, useNavigate } from 'react-router-dom';
import Tag from '../components/common/Tag';
import HeartIcon from '../components/common/HeartIcon';
import { useEffect, useState } from 'react';
import type { NoteDetailResponseDTO } from '../types/NoteDetail';
import api from '../api/axiosInstance';
import { addFollow, removeFollow } from '../api/feed';
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
import ProtectedOverlay from '../components/common/ProtectedOverlay';

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<NoteDetailResponseDTO | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<CommentApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [writer, setWriter] = useState<User>();
  const [isSuccessCodeExpanded, setIsSuccessCodeExpanded] = useState(false);
  const [isFailCodeExpanded, setIsFailCodeExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const { userId } = useUserStore();
  const loginUserId = parseInt(userId ?? '0', 10);

  //   로그인 여부 확인
  const isLoggedIn = useUserStore((state) => state.isAuthenticated);
  if (!isLoggedIn) {
    return <ProtectedOverlay />;
  }

  if (!id) {
    return <div>Invalid note ID</div>;
  }

  const noteId = parseInt(id, 10);

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
      setIsFollowing(noteResponse.data.following);
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
  }, [noteId]);

  const handleLikeToggle = async () => {
    if (!note) return;

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
    }
  };

  const handleToggleFollow = async () => {
    if (!note || !note.user) return;

    const originalFollowingState = isFollowing;
    setIsFollowing(!isFollowing);

    try {
      if (isFollowing) {
        await removeFollow(note.user.userId);
      } else {
        await addFollow(note.user.userId);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      setIsFollowing(originalFollowingState);
    }
  };

  const handleWriteComment = async () => {
    if (!commentText.trim()) return;

    const commentRequest = {
      content: commentText,
    };

    try {
      await api.post(`/feeds/${noteId}/comments`, commentRequest);
      setCommentText('');
      fetchComments();
    } catch (err) {
      console.log('Failed to write comment:', err);
    }
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    if (note) {
      // note의 problemId를 URL에 포함시키고, note 데이터를 state로 전달
      navigate(`/note/generate/${note.problem.problemId}`, { state: { note } });
    }
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = async () => {
    const confirmed = window.confirm('정말로 노트를 삭제하시겠습니까?');
    if (confirmed) {
      try {
        await api.delete(`/notes/${noteId}`);
        navigate('/');
      } catch (err) {
        console.error('노트 삭제에 실패했습니다:', err);
      }
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

  const date = new Date(note.createdAt).toLocaleDateString('ko-KR');
  const image = '';
  const isMyNote = writer?.userId === loginUserId;

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
              {!isMyNote ? (
                <div>
                  <FollowButton
                    following={isFollowing}
                    onToggle={handleToggleFollow}
                  />
                </div>
              ) : (
                <div></div>
              )}
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
              {isMyNote ? (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleEditClick}
                    className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
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
                    onCommentChange={fetchComments}
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
