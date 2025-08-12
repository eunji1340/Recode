import { Outlet, useParams, Navigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
import UserTabBar from "../../components/user/UserTabBar";
import React from "react";

export default function MyPage() {
  const { userId: urlUserId } = useParams<{ userId: string }>();
  const authUserId = useUserStore(state => state.userId);
  
  if (!authUserId) {
    return <Navigate to="/users/login" />;
  }
  
  if (authUserId !== urlUserId) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 sm:p-6 md:p-8 text-[#0B0829]">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-[#13233D]">
          마이페이지
        </h1>

        {/* 탭 바 */}
        <div className="overflow-hidden mb-2">
          <UserTabBar userId={urlUserId} />
        </div>

        {/* 하위 라우트 내용 */}
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}