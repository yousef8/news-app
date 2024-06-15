import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { selectIsAuth, selectUser } from "../../store/auth/authSlice";
import UserMenu from "./UserMenu";
import GuestMenu from "./GuestMenu";

const Header: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const user = useAppSelector(selectUser);
  console.log(user);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img
            src="/newspaper.png"
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top me-2"
          />
          News App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sources">
                Sources
              </Link>
            </li>
          </ul>
          {isAuth ? <UserMenu /> : <GuestMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Header;
