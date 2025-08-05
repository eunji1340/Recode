import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from '../pages/FeedPage';
import ExplorePage from '../pages/ExplorePage';

const AppRouter = () => (
  <Routes>
    <Route path="/feed" element={<FeedPage />} />
    <Route path="/" element={<Navigate to="/feed" replace />} />
    <Route path="/explore" element={<ExplorePage />} />
  </Routes>
);

export default AppRouter;
