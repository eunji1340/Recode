import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo_black.png";

export default function Login() {
  const [recodeId, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("로그인 시도", { recodeId, password });
    // 여기에 API 호출 등을 추가하세요
  };

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md min-h-[500px] p-8 space-y-6 bg-white rounded shadow-lg">
        <form onSubmit={handleLogin} className="space-y-6">
          {/* 로고 + Re:code */}
          <div className="relative flex items-center justify-center h-10">
            <img src={logo} alt="logo" className="h-14 w-auto object-contain " />
            <span className="text-3xl font-bold whitespace-nowrap">
              Re<span className="text-accent">:c</span>ode
            </span>
          </div>

          {/* 아이디 입력 */}
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

          {/* 비밀번호 입력 */}
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

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white rounded-md bg-primary hover:bg-opacity-90 transition"
          >
            로그인
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
