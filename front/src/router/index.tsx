import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from '../pages/FeedPage';
import ExplorePage from '../pages/ExplorePage';
import NoteDetailPage from '../pages/NoteDetailPage';

const AppRouter = () => (
  <Routes>
    <Route path="/feed" element={<FeedPage />} />
    <Route path="/" element={<Navigate to="/feed" replace />} />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/notes/:id" element={<NoteDetailPage />} />
  </Routes>
);

export default AppRouter;
