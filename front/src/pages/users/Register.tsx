import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import logo from "../../assets/images/logo_black.png";

type DupField = "recodeId" | "email" | "nickname";
type BojStatus = "ALREADY_REGISTERED" | "NOT_FOUND_ON_BOJ" | "AVAILABLE" | "ERROR" | null;

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bojId: "",
    recodeId: "",
    email: "",
    nickname: "",
    password: "",
    bio: "",
  });

  // 중복 여부 (true = 이미 존재함)
  const [isDuplicate, setIsDuplicate] = useState<Record<DupField, boolean>>({
    recodeId: true,
    email: true,
    nickname: true,
  });

  // 화면에 보여줄 메시지
  const [msg, setMsg] = useState<{
    bojId: string | null;
    recodeId: string | null;
    email: string | null;
    nickname: string | null;
    submit: string | null;
  }>({
    bojId: null,
    recodeId: null,
    email: null,
    nickname: null,
    submit: null,
  });

  // 색상 분기를 위한 상태 (BOJ 전용)
  const [bojStatus, setBojStatus] = useState<BojStatus>(null);

  // API 경로 매핑
  const apiEndpoints: Record<DupField, string> = {
    recodeId: "users/recodeId_dupcheck",
    email: "users/email_dupcheck",
    nickname: "users/nickname_dupcheck",
  };

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // 사용자가 값 수정하면 해당 필드 메시지는 일단 지움(UX)
    if (name === "recodeId" || name === "email" || name === "nickname") {
      setMsg((prev) => ({ ...prev, [name]: null }));
    }
    if (name === "bojId") {
      setMsg((prev) => ({ ...prev, bojId: null }));
      setBojStatus(null);
    }
  };

  // 중복 체크
  const checkDuplicate = async (field: DupField, value: string) => {
    if (!value) {
      setMsg((prev) => ({ ...prev, [field]: "값을 입력해주세요." }));
      return;
    }
    
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setMsg((prev) => ({ ...prev, email: "올바른 이메일 형식이 아닙니다." }));
        return; // API 호출 안 함
    }
  }

    const apiEndpoint = apiEndpoints[field];
    try {
      const res = await api.post(`${apiEndpoint}`, { [field]: value });
      // 백엔드가 true/false를 data.data에 넣어줌 (true = 이미 존재)
      const exists: boolean = !!res.data?.data;

      setIsDuplicate((prev) => ({ ...prev, [field]: exists }));
      setMsg((prev) => ({
        ...prev,
        [field]: exists ? "이미 존재합니다." : "사용 가능합니다.",
      }));
    } catch (error) {
      console.error("중복 체크 중 오류:", error);
      setMsg((prev) => ({ ...prev, [field]: "중복 체크 중 오류가 발생했습니다." }));
    }
  };

  // 백준아이디 체크 (백엔드가 status/message를 data.data에 내려줌)
  const checkBojId = async (bojId: string) => {
    if (!bojId) {
      setMsg((prev) => ({ ...prev, bojId: "백준 아이디를 입력해주세요." }));
      setBojStatus(null);
      return;
    }

    try {
      const res = await api.post(`users/bojId_check`, { bojId });
      const { status, message } = res.data?.data ?? {};
      setMsg((prev) => ({ ...prev, bojId: message ?? "알 수 없는 응답입니다." }));
      setBojStatus((status as BojStatus) ?? "ERROR");
    } catch (error) {
      console.error("백준 아이디 확인 중 오류:", error);
      setMsg((prev) => ({ ...prev, bojId: "백준 아이디 확인 중 오류가 발생했습니다." }));
      setBojStatus("ERROR");
    }
  };

  // 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 중복 체크 미해결 시 차단
    if (isDuplicate.recodeId || isDuplicate.email || isDuplicate.nickname) {
      setMsg((prev) => ({ ...prev, submit: "중복 체크를 완료해주세요." }));
      return;
    }

    setMsg((prev) => ({ ...prev, submit: null }));

    try {
      const response = await api.post(`/users/register`, form);
      console.log("회원가입 성공:", response.data);
      // 성공 후 이동
      alert("회원가입이 완료되었습니다.");
      navigate("/users/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      setMsg((prev) => ({ ...prev, submit: "회원가입에 실패했습니다. 다시 시도해 주세요." }));
    }
  };

  // 메시지 색상 유틸
  const msgColor = (ok?: boolean) => (ok ? "text-green-600" : "text-red-600");

  const bojColor =
    bojStatus === "AVAILABLE"
      ? "text-green-600"
      : bojStatus === "ALREADY_REGISTERED" || bojStatus === "NOT_FOUND_ON_BOJ" || bojStatus === "ERROR"
      ? "text-red-600"
      : "text-gray-600";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded shadow-md space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 로고 + Re:code */}
          <div className="relative flex items-center justify-center h-10">
            <img src={logo} alt="logo" className="h-14 w-auto object-contain" />
            <span className="text-3xl font-bold whitespace-nowrap">
              Re<span className="text-accent">:c</span>ode
            </span>
          </div>

          {/* 백준 아이디 */}
          <div>
            <label htmlFor="bojId" className="block mb-1 text-gray-700">
              백준 아이디
            </label>
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
                onClick={() => checkBojId(form.bojId)}
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                백준체크
              </button>
            </div>
            {msg.bojId && <p className={`mt-2 text-sm ${bojColor}`}>{msg.bojId}</p>}
          </div>

          {/* 리코드 아이디 */}
          <div>
            <label htmlFor="recodeId" className="block mb-1 text-gray-700">
              아이디
            </label>
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
                onClick={() => checkDuplicate("recodeId", form.recodeId)}
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                중복체크
              </button>
            </div>
            {msg.recodeId && (
              <p className={`mt-2 text-sm ${msgColor(!isDuplicate.recodeId)}`}>{msg.recodeId}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700">
              이메일
            </label>
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
                onClick={() => checkDuplicate("email", form.email)}
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                중복체크
              </button>
            </div>
            {msg.email && <p className={`mt-2 text-sm ${msgColor(!isDuplicate.email)}`}>{msg.email}</p>}
          </div>

          {/* 닉네임 */}
          <div>
            <label htmlFor="nickname" className="block mb-1 text-gray-700">
              닉네임
            </label>
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
                onClick={() => checkDuplicate("nickname", form.nickname)}
                className="px-4 py-2 bg-primary text-fontsecondary rounded hover:bg-accent"
              >
                중복체크
              </button>
            </div>
            {msg.nickname && (
              <p className={`mt-2 text-sm ${msgColor(!isDuplicate.nickname)}`}>{msg.nickname}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700">
              비밀번호
            </label>
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
            <label htmlFor="bio" className="block mb-1 text-gray-700">
              한 마디
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={2}
              value={form.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* 제출 버튼 + 전역 메시지 */}
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded hover:bg-opacity-90 transition disabled:opacity-60"
            disabled={isDuplicate.recodeId || isDuplicate.email || isDuplicate.nickname}
          >
            회원가입
          </button>
          {msg.submit && <p className="text-sm mt-2 text-red-600">{msg.submit}</p>}
        </form>
      </div>
    </div>
  );
}
