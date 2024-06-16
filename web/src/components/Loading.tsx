import React from "react";
import { PacmanLoader } from "react-spinners";

const Loading: React.FC = () => {
  return (
    <div className="loading-container d-flex justify-content-center align-items-center vh-100">
      <PacmanLoader size={80} color={"#123abc"} loading={true} />
    </div>
  );
};

export default Loading;
