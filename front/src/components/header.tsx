// src/components/Header.tsx
import {
  LayoutGrid,
  Search,
  FilePlus,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  LogIn,
} from 'lucide-react';
import clsx from 'clsx';
import logo from '../assets/images/logo_white.png';
import useSidebarStore from '../stores/useSidebarStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

export default function Header() {
  const { collapsed, toggle } = useSidebarStore(); // ✅ 상태 사용
  const navigate = useNavigate();

  // Zustand store에서 인증 상태 가져오기
  const { isAuthenticated, userId, nickname, clearToken, checkAuth } =
    useUserStore();

  // 마운트 시 토큰 유효성 검사
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    clearToken();
    navigate('/users/login');
  };

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 h-screen bg-primary text-fontsecondary flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* 상단 로고 영역 */}
      <div className="relative flex items-center px-4 py-4 w-full mt-6 h-10">
        <img src={logo} alt="logo" className="h-8 w-auto object-contain" />
        <span
          className={clsx(
            'absolute left-14 text-xl font-bold transition-all duration-300 whitespace-nowrap',
            collapsed ? 'opacity-0' : 'opacity-100',
          )}
        >
          Re<span className="text-accent">:c</span>ode
        </span>
      </div>

      {/* 사이드바 열기/닫기 버튼 */}
      <HeaderItem
        icon={
          collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />
        }
        label="사이드바 닫기"
        collapsed={collapsed}
        onClick={toggle}
      />

      {/* 메뉴 */}
      <nav className="flex flex-col gap-4 mt-8 w-full">
        <HeaderItem
          icon={<LayoutGrid size={24} />}
          label="피드 보기"
          collapsed={collapsed}
          onClick={() => navigate(`/feed`)}
        />
        <HeaderItem
          icon={<Search size={24} />}
          label="탐색"
          collapsed={collapsed}
          onClick={() => navigate(`/explore`)}
        />
        <HeaderItem
          icon={<FilePlus size={24} />}
          label="노트 생성"
          collapsed={collapsed}
          onClick={() => navigate(`/note/generate`)}
        />
        <HeaderItem
          icon={<User size={24} />}
          label="마이페이지"
          collapsed={collapsed}
          onClick={() => navigate(`/users/${userId}`)}
        />
      </nav>

      {/* 사용자 메뉴 (사이드바 하단) */}
      <nav className="flex flex-col gap-4 mt-auto mb-4 w-full border-t border-white/20 pt-4">
        {isAuthenticated ? (
          <>
            <HeaderItem
              icon={<User size={24} />}
              label={nickname || 'User'}
              collapsed={collapsed}
              onClick={() => navigate(`/users/${userId}/setting`)}
            />
            <HeaderItem
              icon={<LogOut size={24} />}
              label="로그아웃"
              collapsed={collapsed}
              onClick={handleLogout}
            />
          </>
        ) : (
          <HeaderItem
            icon={<LogIn size={24} />}
            label="로그인"
            collapsed={collapsed}
            onClick={() => navigate('/users/login')}
          />
        )}
      </nav>
    </div>
  );
}

interface HeaderItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
}

function HeaderItem({ icon, label, collapsed, onClick }: HeaderItemProps) {
  return (
    <div
      onClick={onClick}
      className="relative flex items-center h-10 px-4 cursor-pointer hover:text-accent transition-colors"
    >
      <div className="flex-shrink-0">{icon}</div>
      <span
        className={clsx(
          'absolute left-14 transition-all duration-300 whitespace-nowrap',
          collapsed ? 'opacity-0' : 'opacity-100',
        )}
      >
        {label}
      </span>
    </div>
  );
}
