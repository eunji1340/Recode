import { useParams } from 'react-router-dom';
import Tag from '../components/tag';
import HeartIcon from '../components/HeartIcon';
import CommentIcon from '../components/CommentIcon';
import { useEffect, useState } from 'react';
import type { TagProps } from '../components/tag';
import Comment from '../components/Comment';
// import MockCommentData from '../data/MockCommentData'; // 이제 API를 사용하므로 주석 처리
import type { NoteDetail, NoteDetailResponse } from '../types/noteDetail';
import axios from 'axios';
import type { CommentResponse } from '@/types/comment';

const baseURL = import.meta.env.VITE_REST_API_URL;

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<NoteDetail | null>(null);
  const [comments, setComments] = useState<CommentResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!id) {
    return <div>Invalid note ID</div>;
  }

  const noteId = parseInt(id, 10);

  // --- Fetch Note and Comments in Parallel ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // 노트와 댓글 정보 동시에 요청
        const [noteResponse, commentResponse] = await Promise.all([
          axios.get<NoteDetailResponse>(`${baseURL}/notes/${noteId}`),
          axios.get<CommentResponse>(`${baseURL}/feeds/${noteId}/comments`),
        ]);

        setNote(noteResponse.data);
        setComments(commentResponse.data);
        setError(null);
      } catch (err) {
        setError('데이터를 불러오는 중 에러가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [noteId]); // noteId가 변경될 때만 실행

  // --- Mock Data for Likes & Tags (can be replaced with API data later) ---
  const mockLikeandCount = {
    liked: false,
    likes: 6,
    comments: 8, // 이 부분도 실제 댓글 수로 교체할 수 있습니다.
  };
  const [liked, setLiked] = useState(mockLikeandCount.liked);
  const [likes, setLikes] = useState(mockLikeandCount.likes);
  const handleHeartClick = function () {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes((prev) => prev + (nextLiked ? 1 : -1));
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

  return (
    <div className="flex flex-col justify-center items-start p-6 gap-6">
      <div className="w-full bg-white rounded-xl shadow px-5 py-4 space-y-2 text-[#0B0829]">
        {/* 노트 정보 */}
        <div className="note-container">
          <div className="container flex flex-row justify-between">
            <div className="text-2xl font-bold">{note.noteTitle}</div>
            <div className="user-container">
              사용자: {note.userId}
              <button>팔로우 버튼</button>
            </div>
          </div>
          <hr className="my-3 border-t-2 border-gray-300" />
          <div className="text-xl font-bold">
            {note.problemId} {note.problemName}
          </div>
          <div>
            <div className="text-lg font-bold my-3">코드</div>
            <hr className="my-3 border-t-2 border-gray-300" />
            <div className="flex flex-row justify-around">
              <div>
                <div className="text-sm font-bold">성공 코드</div>
                <pre>
                  <code>{note.successCode}</code>
                </pre>
              </div>
              <div>
                <div className="text-sm font-bold">실패 코드</div>
                <pre>
                  <code>{note.failCode}</code>
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
                  {note.tags.map((tag, index) => (
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
                      commentCount={comments?.data?.length ?? 0} // 실제 댓글 수 반영
                    ></CommentIcon>
                  </div>
                </div>
              </div>
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
          {/* 댓글 (API Data) */}
          <div className="comment-container">
            <div className="text-lg font-bold my-3">댓글 보기</div>
            <div>
              {comments && comments.details && comments.details.length > 0 ? (
                comments.details.map((item) => (
                  <Comment
                    key={item.commentId}
                    noteId={item.noteId}
                    content={item.content}
                    createdAt={item.createdAt}
                    nickname={item.user.nickname}
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
