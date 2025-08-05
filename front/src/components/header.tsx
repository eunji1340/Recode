// src/components/Header.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutGrid,
  Search,
  FilePlus,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';

export default function Header() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleHeader = () => setCollapsed((prev) => !prev);

  return (
    <div
      className={clsx(
        'h-screenf bg-primary text-fontsecondary flex flex-col transition-all duration-300',
        collapsed ? 'w-20 items-center' : 'w-64',
      )}
    >
      {/* 상단 로고 영역 */}
      <div className="flex items-center justify-between px-4 py-4 w-full mt-6">
        <div className="flex items-center gap-2">
          {/* <img
            src={logo}
            alt="logo"
            className={clsx(
              "h-8 transition-all duration-300",
              collapsed ? "mx-auto" : ""
            )}
          /> */}
          {!collapsed && (
            <Link to="/" className="text-xl font-bold">
              Re
              <span className="text-accent">:c</span>
              ode
            </Link>
          )}
        </div>
        <button
          onClick={toggleHeader}
          className="text-white hover:text-accent transition-colors"
        >
          {collapsed ? <ChevronRight size={26} /> : <ChevronLeft size={26} />}
        </button>
      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col gap-6 mt-8 px-4 w-full">
        <HeaderItem
          icon={<LayoutGrid size={24} />}
          label="피드 보기"
          collapsed={collapsed}
        />
        <HeaderItem
          icon={<Search size={24} />}
          label="탐색"
          collapsed={collapsed}
        />
        <HeaderItem
          icon={<FilePlus size={24} />}
          label="노트 생성"
          collapsed={collapsed}
        />
        <HeaderItem
          icon={<User size={24} />}
          label="마이페이지"
          collapsed={collapsed}
        />
      </nav>
    </div>
  );
}

interface HeaderItemProps {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

function HeaderItem({ icon, label, collapsed }: HeaderItemProps) {
  return (
    <div className="flex items-center gap-4 hover:text-accent cursor-pointer transition-colors">
      {/* flex-shrink-0 클래스 추가 */}
      <div className="flex-shrink-0">{icon}</div>
      <span
        className={clsx(
          'transition-opacity duration-300 ease-in-out',
          collapsed ? 'opacity-0' : 'opacity-100',
        )}
      >
        {label}
      </span>
    </div>
  );
}
