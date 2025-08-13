import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Login from '../pages/users/Login';
import Register from '../pages/users/Register';
import LandingPage from '../pages/LandingPage';
import Mypage from '../pages/mypage/MyPage';
import FeedPage from '../pages/FeedPage';
import NoteGeneratePage from '../pages/NoteGeneratePage';
import ExplorePage from '../pages/ExplorePage';
import Dashboard from '../pages/mypage/Dashboard';
import NotesPage from '../pages/mypage/NotesPage';
import HeartsPage from '../pages/mypage/HeartsPage';
import CommentsPage from '../pages/mypage/CommentsPage';
import SettingPage from '../pages/mypage/SettingPage';
import NoteDetailPage from '../pages/NoteDetailPage';
import ProblemSelectPage from '../pages/ProblemSelectPage';
import UserDetailPage from '../pages/UserDetailPage';
import { useUserStore } from '../stores/userStore';

// 로그인 체크 컴포넌트
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { userId } = useUserStore();
  const hasSeenLanding = localStorage.getItem('hasSeenLanding') === 'true';

  // 로그인되지 않았으면
  if (!userId) {
    // 랜딩페이지를 본 적이 없으면 랜딩페이지로
    if (!hasSeenLanding) {
      return <Navigate to="/landing" replace />;
    }
    // 랜딩페이지를 본 적이 있으면 로그인 페이지로
    return <Navigate to="/users/login" replace />;
  }

  return <>{children}</>;
}

// 온보딩(랜딩페이지) 체크 컴포넌트
function OnboardingGate({ children }: { children: ReactNode }) {
  const { userId } = useUserStore();
  const hasOnboarded = localStorage.getItem('hasOnboarded');

  // 명시적으로 'false'로 설정된 경우만 온보딩 미완료로 처리
  // (null, undefined, 'true' 모두 완료로 간주 - 기존 사용자 호환성)
  if (userId && hasOnboarded === 'false') {
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
}

// 로그인된 사용자가 로그인/회원가입 페이지에 접근하지 못하도록 하는 컴포넌트
function PublicRoute({ children }: { children: ReactNode }) {
  const { userId } = useUserStore();

  // 이미 로그인되어 있으면 피드로 이동
  if (userId) {
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
}

// 랜딩페이지 래퍼 - 방문 시 온보딩 완료 표시
function LandingPageWrapper() {
  const { userId } = useUserStore();

  // 랜딩페이지 방문 시 표시
  useEffect(() => {
    localStorage.setItem('hasSeenLanding', 'true');
    
    // 로그인된 사용자는 온보딩도 완료로 처리
    if (userId) {
      localStorage.setItem('hasOnboarded', 'true');
    }
  }, [userId]);

  return <LandingPage />;
}

const AppRouter = () => (
  <Routes>
    {/* 랜딩페이지 - 로그인된 사용자만 접근 가능 */}
    <Route path="/landing" element={<LandingPageWrapper />} />
    
    {/* 공개 라우트 - 로그인된 사용자는 접근 불가 */}
    <Route 
      path="/users/login" 
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } 
    />
    <Route 
      path="/users/register" 
      element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } 
    />

    {/* 보호된 라우트 - 로그인 + 온보딩 필수 */}
    <Route 
      path="/feed" 
      element={
        <ProtectedRoute>
          <OnboardingGate>
            <FeedPage />
          </OnboardingGate>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/explore" 
      element={
        <ProtectedRoute>
          <OnboardingGate>
            <ExplorePage />
          </OnboardingGate>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/note/:id" 
      element={
        <ProtectedRoute>
          <OnboardingGate>
            <NoteDetailPage />
          </OnboardingGate>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/user/:userId" 
      element={
        <ProtectedRoute>
          <OnboardingGate>
            <UserDetailPage />
          </OnboardingGate>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/users/:userId" 
      element={
        <ProtectedRoute>
          <OnboardingGate>
            <Mypage />
          </OnboardingGate>
        </ProtectedRoute>
      } 
    >
      <Route index element={<Dashboard />} />
      <Route path="notes" element={<NotesPage />} />
      <Route path="hearts" element={<HeartsPage />} />
      <Route path="comments" element={<CommentsPage />} />
      <Route path="setting" element={<SettingPage />} />
    </Route>
    
    <Route 
      path="/note/generate" 
      element={
        <ProtectedRoute>
          <OnboardingGate>
            <ProblemSelectPage />
          </OnboardingGate>
        </ProtectedRoute>
      } 
    />
    
    <Route 
      path="/note/generate/:id" 
      element={
        <ProtectedRoute>
          <OnboardingGate>
            <NoteGeneratePage />
          </OnboardingGate>
        </ProtectedRoute>
      } 
    />

    {/* 기본 경로 처리 */}
    <Route path="/" element={<Navigate to="/feed" replace />} />
    
    {/* 404 처리 */}
    <Route path="*" element={<Navigate to="/feed" replace />} />
  </Routes>
);

export default AppRouter;