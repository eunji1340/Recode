import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm mx-auto">
        <div className="text-center">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="py-4">{message}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button onClick={onConfirm} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700">
            예
          </button>
          <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
