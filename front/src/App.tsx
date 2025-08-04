
import { useLocation } from "react-router-dom";
import Header from "./components/header";
import AppRouter from "./router";

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ["/users/login", "/users/register", "/about"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {!shouldHideHeader && <Header />}
      <div className="flex-1">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
