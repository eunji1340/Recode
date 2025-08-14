import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/users/login');
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero 영역 */}
      <section className="bg-primary text-white px-8 py-32 text-center min-h-[60vh]">
        <h2 className="text-3xl font-semibold mb-4">
          함께 공유하는 알고리즘 오답노트
        </h2>
        <p className="mb-8 text-lg">
          알고리즘 오답 노트 생성을 도와주는 서비스 제공
        </p>
        <button
          className="bg-accent hover:bg-[#e67e22] text-white font-bold py-3 px-8 rounded text-lg"
          onClick={handleGoToLogin}
        >
          Recode 시작하기
        </button>
      </section>

      {/* 기능 소개 1 */}
      <section className="flex flex-col md:flex-row items-center justify-center py-32 bg-white gap-16 px-4 max-w-7xl mx-auto">
        <div className="text-center md:text-left max-w-md">
          <h3 className="text-2xl font-bold mb-6">
            AI를 통해
            <br />
            알고리즘 오답 노트를
            <br />
            생성해 보세요
          </h3>
          <p className="text-base text-gray-500 leading-relaxed">
            AI가 분석한 맞춤형 오답노트로
            <br />
            문제 해결 과정을 기록하고 
            <br />
            효율적으로 학습하세요
          </p>
        </div>
        <div className="flex-1 max-w-3xl">
          <img
            src="/landing/noteCreate.png"
            alt="오답노트 생성 페이지"
            className="w-full h-auto object-contain rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* 기능 소개 2 */}
      <section className="w-full bg-gradient-to-t from-[#FCF1E8] to-primary text-white">
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 px-4 py-32 max-w-7xl mx-auto">
          <img
            src="/landing/mainFeed.png"
            alt="피드 페이지"
            className="w-full max-w-2xl h-auto object-contain rounded-xl shadow-lg"
          />
          <div className="text-center md:text-left max-w-md">
            <p className="text-xl font-semibold leading-relaxed">
              완성된 오답노트를
              <br />
              공유하며
              <br />
              함께 공부 해 보세요
            </p>
          </div>
        </div>
      </section>

      {/* 하단 CTA */}
      <footer
        className="bg-primary text-white text-center py-6 text-lg font-semibold cursor-pointer"
        onClick={handleGoToLogin}
      >
        Recode 시작하기
      </footer>
    </div>
  );
}
