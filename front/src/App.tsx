<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom';
import Header from './components/header';
import AppRouter from './router';
=======
import { BrowserRouter, useLocation } from 'react-router-dom';
import Header from './components/header';
import AppRouter from './router';

function AppContent() {
  const location = useLocation();
  const showHeader = !location.pathname.startsWith('/note/generate');

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] w-full">
      {showHeader && <Header />}
      <div className="flex-1">
        <AppRouter />
      </div>
    </div>
  );
}
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <div className="flex min-h-screen bg-[#F8F9FA] w-full">
        <Header />
        <div className="flex-1">
          <AppRouter />
        </div>
      </div>
=======
      <AppContent />
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
    </BrowserRouter>
  );
}

export default App;
