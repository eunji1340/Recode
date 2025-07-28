import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#F8F9FA]">
        <Header />
      </div>
    </BrowserRouter>
  );
}

export default App;
