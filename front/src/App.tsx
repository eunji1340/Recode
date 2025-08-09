import { BrowserRouter } from "react-router-dom";
import Header from "./components/header";
import AppRouter from "./router";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#F8F9FA] w-full">
        <Header />
        <div className="flex-1">
          <AppRouter />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
