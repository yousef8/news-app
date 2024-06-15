import React from "react";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import UnSubscribeButton from "../components/UnSubscribeButton";

const Profile: React.FC = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
  }

  return (
    <div className="mt-5">
      <h2 className="mb-4">Profile</h2>
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Name: {user?.name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            Email: {user?.email}
          </h6>
        </div>
      </div>
      <h3 className="mb-4">Subscribed Sources</h3>
      <div className="row">
        {(user?.sourceIds.length || 0) > 0 ? (
          user?.sourceIds.map((sourceId) => (
            <div
              key={sourceId}
              className="col-md-4 d-flex justify-content-between"
            >
              <div className="card mb-3">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-center">{sourceId}</h5>
                  <UnSubscribeButton sourceId={sourceId} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info w-100" role="alert">
            You are not subscribed to any sources. Please{" "}
            <Link to="/sources">subscribe</Link> to some sources.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
