import { matchPath, useLocation } from 'react-router-dom';
import Header from './components/header';
import AppRouter from './router';
import clsx from 'clsx';
import useSidebarStore from './stores/useSidebarStore';

function App() {
  const location = useLocation();
  const hideHeaderRoutes = [
    '/users/login',
    '/users/register',
    '/landing',
    '/note/generate/:id',
  ];
  const shouldHideHeader = hideHeaderRoutes.some((route) => {
    return matchPath(route, location.pathname);
  });

  const { collapsed } = useSidebarStore();

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {!shouldHideHeader && (
        <div className={clsx('transition-all duration-300', {
          // 헤더(사이드바)의 너비를 직접 설정
          'w-64': !collapsed,
          'w-20': collapsed,
        })}>
          <Header />
        </div>
      )}
      {/* 메인 콘텐츠 영역은 남은 공간을 모두 차지하도록 flex-1 적용 */}
      <div className="flex-1 overflow-auto">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
