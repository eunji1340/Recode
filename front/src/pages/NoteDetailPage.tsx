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
import UserImage from '../components/user/UserImage';
import LanguageIcon from '../components/common/LanguageIcon';
import Button from '../components/common/Button';

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
          {/* 헤더 */}
          <div className="container flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* 노트 제목 및 정보 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-extrabold leading-tight">
                  {note.noteTitle}
                </h1>
                {/* 공개/비공개 상태를 뱃지로 표시 */}
                {note.isPublic ? (
                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                    전체 공개
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">
                    비공개
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                작성일: {new Date(note.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>

            {/* 작성자 정보 및 팔로우 버튼 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <UserImage image={image} size={40} />
                <div className="text-lg font-semibold">
                  {note.user.nickname}
                </div>
              </div>
              {!isMyNote && (
                <FollowButton
                  following={isFollowing}
                  onToggle={handleToggleFollow}
                />
              )}
            </div>
          </div>

          {/* 문제 정보 */}
          <div className="bg-[#F8F9FA] rounded-xl shadow p-6 my-6">
            {/* 문제 제목 및 언어 */}
            <div className="flex justify-between items-center mb-3">
              <ProblemTitle
                problemId={note.problem.problemId}
                problemName={note.problem.problemName}
                problemTier={note.problem.problemTier}
                fontSize="text-lg"
              />
              <LanguageIcon language={note.successLanguage} />
            </div>

            {/* 코드 섹션 */}
            <div className="flex flex-col md:flex-row gap-6 mb-3">
              {/* 성공 코드 */}
              <div className="w-full md:w-1/2">
                <p className="mb-2 text-[13px] text-zinc-500 font-semibold font-sans">
                  성공 코드
                </p>
                <div className="bg-gray-800 text-gray-200 rounded-lg overflow-hidden relative">
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isSuccessCodeExpanded ? 'max-h-[1000px]' : 'max-h-40'
                    }`}
                  >
                    <pre className="p-4">
                      <CodePreview
                        code={note.successCode}
                        language={note.successLanguage}
                      />
                    </pre>
                  </div>
                  {!isSuccessCodeExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-800 to-transparent"></div>
                  )}
                </div>
                <button
                  onClick={() =>
                    setIsSuccessCodeExpanded(!isSuccessCodeExpanded)
                  }
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  {isSuccessCodeExpanded ? '접기' : '더 보기'}
                </button>
              </div>

              {/* 실패 코드 */}
              <div className="w-full md:w-1/2">
                <p className="mb-2 text-[13px] text-zinc-500 font-semibold font-sans">
                  실패 코드
                </p>
                <div className="bg-gray-800 text-gray-200 rounded-lg overflow-hidden relative">
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isFailCodeExpanded ? 'max-h-[1000px]' : 'max-h-40'
                    }`}
                  >
                    <pre className="p-4">
                      <CodePreview
                        code={note.failCode}
                        language={note.failLanguage}
                      />
                    </pre>
                  </div>
                  {!isFailCodeExpanded && (
                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-800 to-transparent"></div>
                  )}
                </div>
                <button
                  onClick={() => setIsFailCodeExpanded(!isFailCodeExpanded)}
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  {isFailCodeExpanded ? '접기' : '더 보기'}
                </button>
              </div>
            </div>
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="prose max-w-none text-base leading-relaxed">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {note.content}
                  </Markdown>
                </div>
              </div>
            </div>
          </div>

          {/* footer */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* 태그 목록 */}
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <Tag key={tag.tagId} tagName={tag.tagName} />
                ))}
              </div>

              {/* 좋아요 및 댓글 아이콘 */}
              <div className="flex items-center gap-4">
                <HeartIcon
                  liked={note.liked}
                  likeCount={note.likeCount}
                  onClick={handleLikeToggle}
                />
                <CommentIcon
                  count={comments?.details ? comments.details.length : 0}
                />
              </div>
            </div>

            {/* 수정/삭제 버튼 */}
            {isMyNote && (
              <div className="flex gap-4 mt-4 justify-end">
                <button
                  onClick={handleEditClick}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  수정
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                >
                  삭제
                </button>
              </div>
            )}
          </div>

          <hr className="my-3 border-t-2 border-gray-200" />

          {/* 댓글 섹션 */}
          <div>
            <h2 className="text-xl font-bold mb-4">댓글</h2>
            <div className="bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <div className="w-full">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-150 ease-in-out resize-none text-sm"
                  name="comment-create"
                  rows={3}
                  placeholder="댓글을 입력하세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  maxLength={100}
                ></textarea>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {commentText.length} / 100자
                  </div>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleWriteComment}
                  >
                    댓글 등록
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
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
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    작성된 댓글이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
