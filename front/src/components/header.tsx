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
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import api from '../api/axiosInstance';
import UserImage from './user/UserImage'; // 수정된 UserImage 컴포넌트 import

interface MyInfo {
  nickname: string;
  image?: string;
}

export default function Header() {
  const { collapsed, toggle } = useSidebarStore();
  const navigate = useNavigate();
  const location = useLocation();
  const ranCheckRef = useRef(false);

  const { isAuthenticated, userId, nickname, clearToken, checkAuth } = useUserStore();

  const [userProfile, setUserProfile] = useState<MyInfo | null>(null);

  const pathname = location.pathname;
  const isAuthScreen =
    pathname.startsWith('/users/login') ||
    pathname.startsWith('/users/register');

  const fetchMyInfoWithImage = async () => {
    if (!userId) return;
    try {
      const { data } = await api.get<MyInfo>(`/users/${userId}`);
      setUserProfile(data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    if (isAuthScreen) return;
    if (ranCheckRef.current) return;
    ranCheckRef.current = true;
    
    const isAuth = checkAuth();
    if (isAuth) {
      fetchMyInfoWithImage();
    }
  }, [isAuthScreen, checkAuth]);

  const handleLogout = () => {
    clearToken();
    navigate('/users/login');
  };

  const goProtected = (path: string) => {
    if (!isAuthenticated) return navigate('/users/login');
    navigate(path);
  };

  const goMyPage = () => {
    if (!isAuthenticated || !userId) return navigate('/users/login');
    navigate(`/users/${userId}`);
  };

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 h-screen bg-primary text-fontsecondary flex flex-col transition-all duration-300 z-50',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className="relative flex items-center px-6 py-8 w-full h-10">
        <img src={logo} alt="logo" className="h-8 w-auto object-contain" />
        <span
          className={clsx(
            'absolute left-16 text-xl font-bold transition-all duration-300 whitespace-nowrap',
            collapsed ? 'opacity-0' : 'opacity-100',
          )}
        >
          Re<span className="text-accent">:c</span>ode
        </span>
      </div>

      <HeaderItem
        icon={
          collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />
        }
        label="사이드바 닫기"
        collapsed={collapsed}
        onClick={toggle}
        isActive={false}
      />

      <nav className="flex flex-col gap-4 mt-8 w-full">
        <HeaderItem
          icon={<LayoutGrid size={24} />}
          label="피드 보기"
          collapsed={collapsed}
          onClick={() => navigate('/feed')}
          isActive={pathname === '/feed'}
        />
        <HeaderItem
          icon={<Search size={24} />}
          label="탐색"
          collapsed={collapsed}
          onClick={() => navigate('/explore')}
          isActive={pathname.startsWith('/explore')}
        />
        <HeaderItem
          icon={<FilePlus size={24} />}
          label="노트 생성"
          collapsed={collapsed}
          onClick={() => goProtected('/note/generate')}
          isActive={pathname.startsWith('/note/generate')}
        />
        <HeaderItem
          icon={<User size={24} />}
          label="마이페이지"
          collapsed={collapsed}
          onClick={goMyPage}
          isActive={pathname.startsWith(`/users/${userId}`)}
        />
      </nav>

      <nav className="flex flex-col gap-4 mt-auto mb-4 w-full border-t border-white/20 pt-4">
        {isAuthenticated ? (
          <>
            <div
              className={clsx(
                'flex items-center px-6 py-3 cursor-pointer',
                !collapsed && 'pl-6'
              )}
              onClick={() => goProtected(`/users/${userId}`)}
            >
              {/* UserImage 컴포넌트 사용 */}
              <UserImage image={userProfile?.image} size={32} />
              <span
                className={clsx(
                  'ml-4 transition-all duration-300 whitespace-nowrap',
                  collapsed ? 'opacity-0' : 'opacity-100',
                )}
              >
                {nickname || 'User'}
              </span>
            </div>
            <HeaderItem
              icon={<LogOut size={24} />}
              label="로그아웃"
              collapsed={collapsed}
              onClick={handleLogout}
              isActive={false}
            />
          </>
        ) : (
          <HeaderItem
            icon={<LogIn size={24} />}
            label="로그인"
            collapsed={collapsed}
            onClick={() => navigate('/users/login')}
            isActive={pathname.startsWith('/users/login')}
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
  isActive: boolean;
}

function HeaderItem({ icon, label, collapsed, onClick, isActive }: HeaderItemProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'relative flex items-center h-10 px-6 py-2 cursor-pointer transition-colors duration-200',
        isActive ? 'text-accent' : 'hover:text-accent',
      )}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span
        className={clsx(
          'absolute left-16 transition-all duration-300 whitespace-nowrap',
          collapsed ? 'opacity-0' : 'opacity-100',
        )}
      >
        {label}
      </span>
    </div>
  );
}
