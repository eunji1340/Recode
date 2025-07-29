// src/components/Header.tsx
import { useState } from "react";
import {
  LayoutGrid,
  Search,
  FilePlus,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import logo from "../assets/images/logo_white.png";

export default function Header() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleHeader = () => setCollapsed((prev) => !prev);

  return (
    <div
      className={clsx(
        "h-screen bg-primary text-fontsecondary flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* 상단 로고 영역 */}
      <div className="relative flex items-center px-4 py-4 w-full mt-6 h-10">
        <img src={logo} alt="logo" className="h-8 w-auto object-contain" />
        <span
          className={clsx(
            "absolute left-14 text-xl font-bold transition-all duration-300 whitespace-nowrap",
            collapsed ? "opacity-0" : "opacity-100"
          )}
        >
          Re<span className="text-accent">:c</span>ode
        </span>
      </div>

      {/* 사이드바 열기/닫기 버튼을 HeaderItem으로 통일 */}
      <HeaderItem
        icon={collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        label="사이드바 닫기"
        collapsed={collapsed}
        onClick={toggleHeader}
      />

      {/* 메뉴 */}
      <nav className="flex flex-col gap-4 mt-8  w-full">
        <HeaderItem icon={<LayoutGrid size={24} />} label="피드 보기" collapsed={collapsed} />
        <HeaderItem icon={<Search size={24} />} label="탐색" collapsed={collapsed} />
        <HeaderItem icon={<FilePlus size={24} />} label="노트 생성" collapsed={collapsed} />
        <HeaderItem icon={<User size={24} />} label="마이페이지" collapsed={collapsed} />
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
          "absolute left-14 transition-all duration-300 whitespace-nowrap",
          collapsed ? "opacity-0" : "opacity-100"
        )}
      >
        {label}
      </span>
    </div>
  );
}
