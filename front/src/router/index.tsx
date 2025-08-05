import { Routes, Route } from 'react-router-dom';
import Login from '../pages/users/Login';
import Register from '../pages/users/Register'
import LandingPage from '../pages/LanderingPage';
import Mypage from '../pages/users/MyPage';
const AppRouter = () => (
    <Routes>
        <Route path="/about" element={<LandingPage />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
        <Route path="/users/:userId" element={<Mypage />} />
    </Routes>
);

export default AppRouter;
