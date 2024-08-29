import React, { useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { selectIsAuth } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import LoginAttempt from "../interfaces/loginAttempt";
import Loading from "../components/Loading";
import useFetchUrl from "../hooks/useFetchUrl";

const LoginHistory: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const navigate = useNavigate();
  const { error, loading, data } = useFetchUrl<{
    loginAttempts: LoginAttempt[];
  }>("/login-history", { shouldFetch: isAuth });

  const loginAttempts = data?.loginAttempts;

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
      return;
    }
  }, [isAuth, navigate]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );

  return (
    <div className="mt-5">
      <h2 className="mb-4">Login History</h2>
      {loginAttempts?.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No login attempts found.
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">IP</th>
              <th scope="col">Status</th>
              <th scope="col">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loginAttempts?.map((attempt, index) => (
              <tr key={attempt.timestamp}>
                <th scope="row">{index + 1}</th>
                <td>{attempt.ip}</td>
                <td>{attempt.success ? "Success" : "Failure"}</td>
                <td>{new Date(attempt.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoginHistory;
