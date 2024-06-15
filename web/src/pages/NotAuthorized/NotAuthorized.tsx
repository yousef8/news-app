import React from "react";
import { Link } from "react-router-dom";
import "./NotAuthorized.css";

const NotAuthorized: React.FC = () => {
  return (
    <div className="not-authorized-container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-4">403</h1>
        <h2 className="mb-4">Not Authorized</h2>
        <p className="mb-4">You do not have permission to access this page.</p>
        <Link to="/" className="btn btn-primary">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotAuthorized;
