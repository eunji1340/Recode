// src/pages/users/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import logo from "../../assets/images/logo_black.png";
import { useUserStore } from "../../stores/userStore";

export default function Login() {
  const navigate = useNavigate();
  const [recodeId, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setToken = useUserStore((s) => s.setToken);
  const setUserInfo = useUserStore((s) => s.setUserInfo);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // ★ refresh는 서버가 HttpOnly 쿠키로 세팅 (withCredentials=true)
      const res = await api.post("/users/login", { recodeId, password });
      const data = res.data?.data ?? res.data;

      const accessToken: string | undefined = data?.accessToken;
      const userId: number | string | undefined = data?.userId;
      const nickname: string | undefined = data?.nickname;

      if (!accessToken) throw new Error("액세스 토큰이 응답에 없습니다.");

      setToken(accessToken);
      if (userId != null && nickname != null) {
        setUserInfo(userId, nickname);
      }

      alert("로그인 성공!");
      navigate("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "로그인에 실패했습니다. 아이디/비밀번호를 확인해주세요.";
      console.error("로그인 실패:", err);
      alert(msg);
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
              required
            />
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
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white rounded-md bg-primary hover:bg-opacity-90 transition disabled:opacity-60"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/users/register")}
            className="w-full px-4 py-2 font-semibold text-white rounded-md bg-accent hover:bg-opacity-90 transition"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
