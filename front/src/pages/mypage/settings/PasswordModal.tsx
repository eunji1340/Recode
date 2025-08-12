import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../components/common/Button';

// 비밀번호 길이 제한 상수
const MAX_PASSWORD_LENGTH = 50;

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
  const [newPasswordError, setNewPasswordError] = useState('');

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

  // 새 비밀번호 입력 시 실시간 유효성 검사
  useEffect(() => {
    if (newPassword.length > MAX_PASSWORD_LENGTH) {
      setNewPasswordError(`비밀번호는 ${MAX_PASSWORD_LENGTH}자 이하로 입력해주세요.`);
    } else {
      setNewPasswordError('');
    }
  }, [newPassword]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // 버튼 클릭 시 모든 필수 필드 검사
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    // 실시간 검사를 통해 이미 에러가 있다면 제출하지 않음
    if (newPasswordError) {
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('현재 비밀번호와 새 비밀번호가 동일합니다.');
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
    } catch (err: any) {
      // 403 에러 코드를 확인하여 비밀번호 오류 메시지를 표시합니다.
      // err.response는 axios와 같은 라이브러리를 사용할 때 주로 존재합니다.
      if (err.response && err.response.status === 403) {
        setError('현재 비밀번호가 올바르지 않습니다.');
      } else {
        // 그 외의 에러는 일반적인 실패 메시지를 표시합니다.
        setError(err.message || '비밀번호 변경에 실패했습니다.');
      }
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
    setNewPasswordError(''); // 새 비밀번호 에러 상태도 초기화
    onClose();
  };

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
            <div className="relative">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`border rounded-md p-2 pr-12 w-full ${newPasswordError ? 'border-red-500' : ''}`}
                disabled={isSubmitting}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                {newPassword.length}/{MAX_PASSWORD_LENGTH}
              </div>
            </div>
            {newPasswordError && <p className="text-sm text-red-500 mt-1">{newPasswordError}</p>}
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
          <Button
            variant="filled"
            onClick={handleSubmit}
            disabled={isSubmitting || !!newPasswordError}
          >
            {isSubmitting ? '변경 중...' : '변경'}
          </Button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
