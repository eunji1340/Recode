import { Routes, Route, Navigate } from 'react-router-dom';
import FeedPage from '../pages/FeedPage';
import ExplorePage from '../pages/ExplorePage';
<<<<<<< HEAD
=======
import NoteGeneratePage from '../pages/NoteGeneratePage';
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)

const AppRouter = () => (
  <Routes>
    <Route path="/feed" element={<FeedPage />} />
    <Route path="/" element={<Navigate to="/feed" replace />} />
    <Route path="/explore" element={<ExplorePage />} />
<<<<<<< HEAD
=======
    <Route path="/note/generate" element={<NoteGeneratePage />} />
>>>>>>> a795b15 (feat(code): 노트 생성 페이지 라우터에 연동 & header 제거)
  </Routes>
);

export default AppRouter;
