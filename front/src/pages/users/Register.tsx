import { useState } from "react";
import logo from "../../assets/images/logo_black.png"; 


export default function Register() {
  const [form, setForm] = useState({
    bojId:"",
    recodeId: "",
    email: "",
    nickname: "",
    password: "",
    userTier: "",
    bio: "",
  });

  const checkDuplicate = (field: string, value: string) => {
    if (!value) {
      alert("값을 입력해주세요.");
      return;
    }

    // 중복 확인 API 요청
    console.log(`중복체크 요청: ${field} = ${value}`);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("회원가입 정보:", form);
    // 회원가입 API 연결
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
          {/* <div>
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
                onClick={() => checkDuplicate('bojId', form.bojId)} // 중복 체크 함수
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                중복체크
              </button>
            </div>
          </div> */}

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
                type="text"
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

          {/* 티어 */}
          {/* <div>
            <label htmlFor="userTier" className="block mb-1 text-gray-700">백준 티어</label>
            <input
              type="text"
              id="userTier"
              name="userTier"
              value={form.userTier}
              onChange={handleChange}
              placeholder="ex) Gold IV"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div> */}

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
