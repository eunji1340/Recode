import { Routes, Route } from 'react-router-dom';
import Login from '../pages/users/Login';
import Register from '../pages/users/Register'
import LandingPage from '../pages/LanderingPage';
const AppRouter = () => (
    <Routes>
        <Route path="/about" element={<LandingPage />} />
        <Route path="/users/login" element={<Login />} />
        <Route path="/users/register" element={<Register />} />
    </Routes>
);

export default AppRouter;
