import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axiosInstance';
import logo from '../../assets/images/logo_black.png';
import { useUserStore } from '../../stores/userStore';

// 입력 필드 최대 길이 상수
const MAX_RECODEID_LENGTH = 20;
const MAX_PASSWORD_LENGTH = 50;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setToken = useUserStore((s) => s.setToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);

  const [recodeId, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 후 리다이렉트할 경로 설정
  let from = (location.state as any)?.from?.pathname || '/feed';
  const publicPaths = ['/', '/landing', '/users/login', '/users/register'];
  if (publicPaths.includes(from)) {
    from = '/feed';
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      // 서버에 로그인 요청
      const res = await api.post('/users/login', { recodeId, password });
      const data = res.data?.data ?? res.data;
      const { accessToken, userId, nickname } = data;

      if (!accessToken) {
        throw new Error('액세스 토큰이 없습니다.');
      }

      setToken(accessToken);
      if (userId != null && nickname != null) {
        setUserInfo(userId, nickname);
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('로그인 실패:', err);
      // 403 Forbidden 에러일 때 특정 메시지 표시
      if (err?.response?.status === 403) {
        setError('아이디 혹은 비밀번호가 틀렸습니다.');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md min-h-[500px] p-8 space-y-6 bg-white rounded shadow-lg">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative flex items-center justify-center h-10">
            <img src={logo} alt="logo" className="h-14 w-auto object-contain" />
            <span className="text-3xl font-bold whitespace-nowrap ml-2">
              Re<span className="text-accent">:c</span>ode
            </span>
          </div>

          <div>
            <label htmlFor="recodeId" className="block mb-1 text-gray-700">
              아이디
            </label>
            <input
              type="text"
              id="recodeId"
              value={recodeId}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={MAX_RECODEID_LENGTH}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {recodeId.length}/{MAX_RECODEID_LENGTH}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={MAX_PASSWORD_LENGTH}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {password.length}/{MAX_PASSWORD_LENGTH}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white rounded-md bg-primary hover:bg-opacity-90 transition disabled:opacity-60"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/users/register')}
            className="w-full px-4 py-2 font-semibold text-white rounded-md bg-accent hover:bg-opacity-90 transition"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
