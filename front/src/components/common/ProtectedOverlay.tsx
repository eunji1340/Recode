import { useNavigate } from 'react-router-dom';

export default function ProtectedOverlay() {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/users/login');
  };
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 backdrop-blur-sm bg-white/30"></div>

      <div className="relative flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold text-black">
          로그인하고 더 많은 기능을 누려보세요
        </h2>
        <button
          onClick={handleLoginClick}
          className="mt-6 px-6 py-3 bg-accent text-white rounded-lg shadow-lg hover:bg-opacity-90 transition-colors"
        >
          로그인하기
        </button>
      </div>
    </div>
  );
}
