import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sources from "./pages/Sources";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAppDispatch } from "./store/hooks";
import { useEffect } from "react";
import { userData } from "./store/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userData());
  });
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="container-lg">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
