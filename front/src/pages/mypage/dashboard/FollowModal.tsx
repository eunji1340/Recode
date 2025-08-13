// src/pages/mypage/dashboard/FollowModal.tsx
import { tierImageMap } from '../../../data/tierMap';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';

export interface FollowDetail {
  userId: number;
  bojId: string;
  nickname: string;
  userTier: number;
  image?: string;
  isFollowing?: boolean;
  onToggleFollow?: (userId: number) => void;
}

interface Props {
  open: boolean;
  activeTab: 'followers' | 'followings';
  details: FollowDetail[];
  loading: boolean;
  onClose: () => void;
  onTabChange: (tab: 'followers' | 'followings') => void;
}

export default function FollowModal({
  open,
  activeTab,
  details,
  loading,
  onClose,
  onTabChange,
}: Props) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleUserClick = (userId: number) => {
    onClose();
    navigate(`/user/${userId}`);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow w-96 h-96 flex flex-col relative">
        {/* 탭 & 닫기 */}
        <div className="flex items-center justify-center border-b relative px-4 py-2">
          <div className="flex space-x-6">
            {(['followers', 'followings'] as const).map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-2 text-center ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 font-semibold'
                    : 'text-gray-600'
                }`}
                onClick={() => onTabChange(tab)}
              >
                {tab === 'followers' ? '팔로워' : '팔로잉'}
              </button>
            ))}
          </div>
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* 목록 */}
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <p>로딩 중...</p>
          ) : details.length ? (
            <ul>
              {details.map((d) => (
                <li
                  key={d.userId}
                  className="py-2 border-b last:border-b-0 flex items-center relative cursor-pointer hover:bg-gray-50"
                  onClick={() => handleUserClick(d.userId)}
                >
                  <img
                    src={tierImageMap[d.userTier]}
                    alt={`티어 ${d.userTier}`}
                    className="w-5 h-6"
                  />
                  <span className="absolute left-1/2 transform -translate-x-1/2 font-medium">
                    {d.nickname}
                  </span>
                  <span className="ml-auto text-sm text-gray-600">
                    ({d.bojId})
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">데이터가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
