import { useState } from 'react';
import api from '../../api/axiosInstance';
import type { CommentResponseDTO } from '../../types/comment';
import { useUserStore } from '../../stores/userStore';
import { useSubmit } from 'react-router-dom';

export default function Comment({
  commentId,
  user,
  noteId,
  content,
  createdAt,
  onCommentChange,
}: CommentResponseDTO & { onCommentChange: () => void }) {
  // --- 추가: 수정 모드를 위한 상태 ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const { userId } = useUserStore();

  const loginUserId = parseInt(userId, 10);

  // timestamp Date String으로 변환
  const date = new Date(createdAt).toLocaleDateString('ko-KR');

  const handleDeleteComment = async () => {
    try {
      await api.delete(`/feeds/${noteId}/comments/${commentId}`);
      onCommentChange(); // 성공 시 목록 새로고침
    } catch (err) {
      console.log(err);
    }
  };

  // --- 추가: 수정 관련 핸들러 ---
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content); // 수정 취소 시 원래 내용으로 복구
  };

  const handleSave = async () => {
    if (!editedContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await api.put(`/feeds/${noteId}/comments/${commentId}`, {
        content: editedContent,
      });
      onCommentChange(); // 성공 시 목록 새로고침
      setIsEditing(false); // 보기 모드로 전환
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };
  // -----------------------------

  return (
    <div className="comment-container flex flex-row justify-between my-2 p-3 border-b">
      {/* <div>사진{profilePic}</div> */}
      <div className="flex-grow mx-4">
        <div>{user.nickname}</div>
        {loginUserId === user.userId && isEditing ? (
          // --- 수정 모드 UI ---
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg mt-2 resize-none"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={3}
          />
        ) : (
          // --- 보기 모드 UI ---
          <div className="text-md font-bold my-3 text-left">{content}</div>
        )}
      </div>
      <div className="flex flex-col items-end">
        {loginUserId === user.userId &&
          (isEditing ? (
            // --- 수정 모드 버튼 ---
            <div className="flex gap-2 mt-4">
              <button
                className="px-2 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                onClick={handleCancel}
              >
                취소
              </button>
              <button onClick={handleSave}>저장</button>
            </div>
          ) : (
            // --- 보기 모드 버튼 ---
            <div className="flex gap-2 mt-4">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                onClick={handleEdit}
              >
                수정
              </button>
              <button
                className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={handleDeleteComment}
              >
                삭제
              </button>
            </div>
          ))}
        <div className="text-sm text-gray-500 mt-2">작성일: {date}</div>
      </div>
    </div>
  );
}
