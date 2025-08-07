// MyPage.tsx
import { Outlet, useParams, Navigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import UserTabBar from "../../components/user/UserTabBar";

export default function MyPage() {
  const { userId : urlUserId } = useParams<{ userId: string }>(); // /users/:userId 경로에서 userId 가져오기
  const authUserId = useUserStore( state => state.userId );
  
  // 혹시라도 userId가 없으면 렌더링 막기
  if (!authUserId) return null; 

  // 로그인한 유저 Id 값아니면 원하는 경로로 보내기(추후 타인 디테일로)
  if (authUserId !== urlUserId) {
    return <Navigate to="/"/>
  }
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-5">마이페이지</h1>

      {/* ✅ 공통 탭 바 */}
      <UserTabBar userId={urlUserId} />

      {/* ✅ 하위 라우트 (대시보드/오답노트/설정 등) */}
      <div className="mt-3">
        <Outlet />
      </div>
    </div>
  );
}
