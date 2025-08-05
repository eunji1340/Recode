import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance"
import logo from "../../assets/images/logo_black.png";


export default function Login() {
  const [recodeId, setId] = useState("");
  const [password, setPassword] = useState("");

   const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login",{recodeId, password,});

      console.log("로그인 성공:", response.data);
      
      // ✅ userId, 닉네임 저장 (토큰 방식 도입 전까지 임시 로그인 유지용)
      localStorage.setItem("userId", response.data.data.userId); 
      localStorage.setItem("nickname", response.data.data.nickname); 
      
      // TODO: 토큰 저장 or 사용자 정보 저장 (필요 시)
      // 예: localStorage.setItem("token", response.data.token);
      // 로그인 할 때마다 solved.ac 조회 사용자 정보 가져와서 티어 갱신 
      alert("로그인 성공!");
      navigate("/"); // 메인 페이지로 이동
    } catch (error: any) {
      console.error("로그인 실패:", error);
      alert("로그인에 실패했습니다. 아이디나 비밀번호를 확인하세요.");
    }
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
