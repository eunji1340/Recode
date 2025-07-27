import Header from './components/Header';  // 사이드 헤더
import FeedCard from './components/feed/FeedCard';

function App() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* 좌측 헤더 */}
      <Header />

      {/* 우측 콘텐츠 영역 */}
      <main className="flex-1 flex justify-center items-center p-4">
        <FeedCard />
      </main>
    </div>
  );
}

export default App;
