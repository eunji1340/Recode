// src/pages/users/Mypage.tsx
import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";

export default function Mypage() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId")

  const tabs = [
    { label: "대시보드", path: `/users/${userId}`},
    { label: "오답노트", path: `/users/${userId}/notes`},
    { label: "좋아요", path: `/users/${userId}/hearts`},
    { label: "댓글", path: `/users/${userId}/comments`},
    { label: "설정", path: `/users/${userId}/setting`},
  ]

 return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* 상단 타이틀 */}
      <h1 className="text-4xl font-bold mb-8">마이페이지</h1>

      {/* 탭 메뉴 */}
      <nav className="flex space-x-6 border-b pb-0 text-lg font-medium relative">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={clsx(
                "relative pb-2 text-gray-700 hover:text-accent transition-colors",
                { "text-primary font-semibold": isActive }
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 프로필 카드 */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img
            src="/assets/default-avatar.png"
            alt="프로필"
            className="w-16 h-16 rounded-full bg-gray-200"
          />
          <div>
            <p className="text-xl font-bold">UserId (bojId)</p>
            <p className="text-sm text-gray-600">email</p>
            <p className="text-sm text-green-500 mt-1">bio</p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="text-sm text-gray-500">팔로잉</div>
          <div className="text-xl font-semibold">13</div>
          <div className="text-sm text-gray-500 mt-2">팔로워</div>
          <div className="text-xl font-semibold">30</div>
        </div>
      </div>
    </div>
  );
}
