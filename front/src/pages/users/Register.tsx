import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/logo_black.png"; 


export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bojId:"",
    recodeId: "",
    email: "",
    nickname: "",
    password: "",
    bio: "",
  });

  const API_URL = "http://localhost:8080"; // 백엔드 서버의 기본 URL

  // 중복 체크 상태
  const [isDuplicate, setIsDuplicate] = useState({
    recodeId: true,
    email: true,
    nickname: true,
  });

    // API 경로 매핑
  const apiEndpoints: Record<string, string> = {
    recodeId: "users/recodeId_dupcheck",  // recodeId에 대한 경로
    email: "users/email_dupcheck",      // email에 대한 경로
    nickname: "users/nickname_dupcheck",// nickname에 대한 경로
  };


  // 중복 체크 함수
  const checkDuplicate = async (field: string, value: string) => {
    if (!value) {
      alert("값을 입력해주세요.");
      return;
    }
    const apiEndpoint = apiEndpoints[field];

    if (!apiEndpoint) {
      alert("잘못된 필드입니다.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/${apiEndpoint}`,{[field]: value});
      if (response.data.data) {
        setIsDuplicate((prev) => ({ ...prev, [field]: true }));
        alert(`${field}이(가) 이미 존재합니다.`);
      } else {
        setIsDuplicate((prev) => ({ ...prev, [field]: false }));
        console.log(response.data)
        alert(`${field} 사용 가능합니다.`);
      }
    } catch (error) {
      console.error("중복 체크 중 오류 발생:", error);
      alert("중복 체크 중 오류가 발생했습니다.");
    }
  };
  // 백준아이디 체크 함수 
  const checkBojId = async (bojId: string) => {
    if (!bojId) {
      alert("백준 아이디를 입력해주세요.");
      return;
    }

    try {
      const payload = { bojId };
      console.log("백엔드로 보낼 값:", payload); // ✅ 이 줄 추가

      const response = await axios.post(`${API_URL}/users/bojId_check`, { bojId });
      console.log(response.data)
      if (response.data.data) {
        alert("존재하는 백준 아이디입니다.");
      } else {
        alert("존재하지 않는 백준 아이디입니다.");
      }
    } catch (error) {
      console.error("백준 아이디 확인 중 오류:", error);
      alert("백준 아이디 확인 중 오류가 발생했습니다.");
    }
  };

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (isDuplicate.recodeId || isDuplicate.email || isDuplicate.nickname) {
    alert("중복 체크를 완료해주세요.");
    return;
  }

  console.log("회원가입 데이터:", form);
  
  try {
    const response = await axios.post(`${API_URL}/users/register`, form);
    console.log("회원가입 성공:", response.data);
    // 회원가입 성공 후 처리 (예: 로그인 페이지로 리디렉션)
    alert("회원가입이 완료되었습니다.");
    navigate("/users/login");
  } catch (error) {
    console.error("회원가입 실패:", error);
    alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
  }
};

  return (
    <div className="flex items-center justify-center max-h-full bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded shadow-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 로고 + Re:code */}
          <div className="relative flex items-center justify-center h-10">
            <img src={logo} alt="logo" className="h-14 w-auto object-contain " />
            <span className="text-3xl font-bold whitespace-nowrap">
              Re<span className="text-accent">:c</span>ode
            </span>
          </div>
          {/* 백준 아이디 */}
          <div>
            <label htmlFor="bojId" className="block mb-1 text-gray-700">백준 아이디</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="bojId"
                name="bojId"
                value={form.bojId}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => checkBojId(form.bojId)} // 중복 체크 함수
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                백준체크
              </button>
            </div>
          </div>

          {/* 리코드 아이디 */}
          <div>
            <label htmlFor="recodeId" className="block mb-1 text-gray-700">아이디</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="recodeId"
                name="recodeId"
                value={form.recodeId}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => checkDuplicate('recodeId', form.recodeId)} // 중복 체크 함수
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                중복체크
              </button>
            </div>
          </div>
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700">이메일</label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => checkDuplicate('email', form.email)} // 중복 체크 함수
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                중복체크
              </button>
            </div>
          </div>
          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className="block mb-1 text-gray-700">닉네임</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => checkDuplicate('nickname', form.nickname)} // 중복 체크 함수
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                중복체크
              </button>
            </div>
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* 한 마디 */}
          <div>
            <label htmlFor="bio" className="block mb-1 text-gray-700">한 마디</label>
            <textarea
              id="bio"
              name="bio"
              rows={2}
              value={form.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            className="w-full py-2 bg-[#13233D] text-white rounded hover:bg-opacity-90 transition"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
