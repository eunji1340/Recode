import { useNavigate, useLocation } from "react-router-dom";
import clsx from "clsx";

interface UserTabBarProps {
  userId: string;
}

export default function UserTabBar({ userId }: UserTabBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: "대시보드", path: `/users/${userId}` },
    { label: "오답노트", path: `/users/${userId}/notes` },
    { label: "좋아요", path: `/users/${userId}/hearts` },
    { label: "댓글", path: `/users/${userId}/comments` },
    { label: "설정", path: `/users/${userId}/setting` },
  ];

  return (
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
  );
}
