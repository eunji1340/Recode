// MyPage.tsx
import { Outlet, useParams } from "react-router-dom";
import UserTabBar from "../../components/user/UserTabBar";

export default function MyPage() {
  const { userId } = useParams(); // /users/:userId 경로에서 userId 가져오기

  if (!userId) return null; // 혹시라도 userId가 없으면 렌더링 막기

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">마이페이지</h1>

      {/* ✅ 공통 탭 바 */}
      <UserTabBar userId={userId} />

      {/* ✅ 하위 라우트 (대시보드/오답노트/설정 등) */}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
}
