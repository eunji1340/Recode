import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // ReactDOM 임포트 추가
import Button from '../../../components/common/Button';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function PasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: PasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달이 열릴 때 body 스크롤을 막고, 닫힐 때 해제합니다.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(currentPassword, newPassword);
      // 성공적으로 변경 후 상태 초기화
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      onClose();
      // 성공 알림은 부모 컴포넌트에서 처리하는 것이 좋습니다.
      // alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (err: any) {
      setError(err.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // 모달 닫기 버튼 클릭 시 상태 초기화 후 닫기
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setError('');
    onClose();
  }

  // 모달 콘텐츠
  const modalContent = (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">비밀번호 변경</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">현재 비밀번호 *</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="border rounded-md p-2 w-full"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">새 비밀번호 *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-md p-2 w-full"
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">새 비밀번호 확인 *</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="border rounded-md p-2 w-full"
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button variant="filled" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '변경 중...' : '변경'}
          </Button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
