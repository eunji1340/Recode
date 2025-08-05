import { useLocation } from 'react-router-dom';

import Header from './components/header';
import AppRouter from './router';
import clsx from 'clsx';
import useSidebarStore from './stores/useSidebarStore';

function App() {
  const location = useLocation();
  const hideHeaderRoutes = new Set([
    '/users/login',
    '/users/register',
    '/about',
    '/note/generate',
  ]);
  const shouldHideHeader = hideHeaderRoutes.has(location.pathname);

  const { collapsed } = useSidebarStore();

  const marginClass = shouldHideHeader ? 'ml-0' : collapsed ? 'ml-20' : 'ml-64';

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {!shouldHideHeader && <Header />}
      <div className={clsx('transition-all duration-300 flex-1', marginClass)}>
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
