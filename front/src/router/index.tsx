import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/users/Login';
import Register from '../pages/users/Register'
import LandingPage from '../pages/LanderingPage';
import Mypage from '../pages/mypage/MyPage';
import FeedPage from '../pages/FeedPage';
import NoteGeneratePage from '../pages/NoteGeneratePage';
import ExplorePage from '../pages/ExplorePage';
import Dashboard from '../pages/mypage/Dashboard';
import NotesPage from '../pages/mypage/NotesPage';
import HeartsPage from '../pages/mypage/HeartsPage';
import CommentsPage from '../pages/mypage/CommentsPage';
import SettingPage from '../pages/mypage/SettingPage';

const AppRouter = () => (
    <Routes>
        <Route path="/about" element={<LandingPage />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/:userId" element={<Mypage />}>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="hearts" element={<HeartsPage />} />
          <Route path="comments" element={<CommentsPage />} />
          <Route path="setting" element={<SettingPage />} />
        </Route>  
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/note/generate" element={<NoteGeneratePage />} />

    </Routes>
);

export default AppRouter;
