import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    const hadleGoToLogin = () => {
        navigate("/users/login");
    }
    
    return (
        <div className="w-full min-h-screen bg-white">
        {/* Hero 영역 - 더 크게 */}
        <section className="bg-primary text-white px-8 py-32 text-center min-h-[60vh]">
            <h2 className="text-3xl font-semibold mb-4">함께 공유하는 알고리즘 오답노트</h2>
            <p className="mb-8 text-lg">알고리즘 오답 노트 생성을 도와주는 서비스 제공</p>
            <button className="bg-accent hover:bg-[#e67e22] text-white font-bold py-3 px-8 rounded text-lg"
             onClick={hadleGoToLogin}
            >
            Recode 시작하기
            </button>
        </section>

        {/* 기능 소개 1 */}
        <section className="flex flex-col md:flex-row items-center justify-center py-32 bg-white gap-16 px-4 min-h-[70vh]">
            <div className="text-center md:text-left max-w-md">
            <h3 className="text-2xl font-bold mb-6">AI를 통해<br />알고리즘 오답 노트를<br />생성해 보세요</h3>
            <p className="text-base text-gray-500 leading-relaxed">
                AI를 활용한 코드 리뷰<br />
                시간 분류, 정답 분류, 관련 태그까지를 통해<br />
                오답노트 생성을 도와줘요
            </p>
            </div>
            <div className="w-72 h-72 bg-gray-200 flex items-center justify-center font-bold text-center">
            오답노트 생성<br />페이지
            </div>
        </section>

        {/* 기능 소개 2 */}
        <section className="flex flex-col md:flex-row items-center justify-center py-32 bg-gradient-to-t from-[#FCF1E8] to-primary text-white gap-16 px-4 min-h-[70vh]">
            <div className="w-72 h-72 bg-white text-black flex items-center justify-center font-bold text-center">
            피드 페이지<br />내 오답노트
            </div>
            <div className="text-center md:text-left max-w-md">
            <p className="text-xl font-semibold leading-relaxed">
                완성된 오답노트를<br />공유하며<br />함께 공부 해 보세요
            </p>
            </div>
        </section>

        {/* 하단 CTA */}
        <footer className="bg-primary text-white text-center py-6 text-lg font-semibold"
         onClick={hadleGoToLogin}
        >
            Recode 시작하기
        </footer>
        </div>
    );
    }
