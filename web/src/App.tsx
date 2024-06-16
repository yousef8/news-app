import Header from "./components/Header/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SubscriptionNews from "./pages/SubscriptionNews";
import Sources from "./pages/Sources";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import { selectIsAuth, userData } from "./store/auth/authSlice";
import LoginHistory from "./pages/LoginHistory";
import Profile from "./pages/Profile";
import { Slide, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotFound from "./pages/NotFound/NotFound";
import NotAuthorized from "./pages/NotAuthorized/NotAuthorized";

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "colored",
  transition: Slide,
};

function App() {
  const isAuth = useAppSelector(selectIsAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userData());
  }, []);
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="container-lg">
          <Routes>
            <Route path="/" element={<SubscriptionNews />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/login-history"
              element={isAuth ? <LoginHistory /> : <NotAuthorized />}
            />
            <Route
              path="/profile"
              element={isAuth ? <Profile /> : <NotAuthorized />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ToastContainer {...toastOptions} />
      </BrowserRouter>
    </>
  );
}

export default App;
