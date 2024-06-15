import React from "react";
import { Link } from "react-router-dom";

const GuestMenu: React.FC = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/signup">
          Sign Up
        </Link>
      </li>
    </>
  );
};

export default GuestMenu;
