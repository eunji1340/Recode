import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from '../pages/FeedPage';
import NoteGeneratePage from '../pages/NoteGeneratePage';
import ExplorePage from '../pages/ExplorePage';
import NoteDetailPage from '../pages/NoteDetailPage';

const AppRouter = () => (
  <Routes>
    <Route path="/feed" element={<FeedPage />} />
    <Route path="/" element={<Navigate to="/feed" replace />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/note/:id" element={<NoteDetailPage />} />
    <Route path="/note/generate" element={<NoteGeneratePage />} />
  </Routes>
);

export default AppRouter;
