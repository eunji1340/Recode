import { useState } from 'react';
import api from '../../api/axiosInstance';
import type { CommentResponseDTO } from '../../types/comment';
import { useUserStore } from '../../stores/userStore';
import Button from '../common/Button';
import UserImage from '../user/UserImage';

export default function Comment({
  commentId,
  user,
  noteId,
  content,
  createdAt,
  onCommentChange,
}: CommentResponseDTO & { onCommentChange: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const { userId } = useUserStore();
  const loginUserId = parseInt(userId ?? '0', 10);
  const isMyComment = loginUserId === user.userId;

  const date = new Date(createdAt).toLocaleDateString('ko-KR');

  const handleDeleteComment = async () => {
    try {
      await api.delete(`/feeds/${noteId}/comments/${commentId}`);
      onCommentChange();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(content);
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
      onCommentChange();
      setIsEditing(false);
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <UserImage image={user.image} size={32} />

      {/* Main Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-800">{user.nickname}</span>
          <span className="text-sm text-gray-500">작성일: {date}</span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition resize-none text-sm"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
              maxLength={100}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                취소
              </Button>
              <Button variant="filled" size="sm" onClick={handleSave}>
                저장
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-gray-700 break-words leading-relaxed">
            {content}
          </div>
        )}
      </div>

      {/* Edit/Delete buttons */}
      {isMyComment && !isEditing && (
        <div className="flex items-start gap-2">
          <Button variant="edit" size="sm" onClick={handleEdit}>
            수정
          </Button>
          <Button variant="danger" size="sm" onClick={handleDeleteComment}>
            삭제
          </Button>
        </div>
      )}
    </div>
  );
}