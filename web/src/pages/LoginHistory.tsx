import React, { useEffect, useState } from "react";
import api from "../api";
import { useAppSelector } from "../store/hooks";
import { selectIsAuth } from "../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import LoginAttempt from "../interfaces/loginAttempt";

const LoginHistory: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const navigate = useNavigate();
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    const fetchLoginHistory = async () => {
      try {
        const response = await api.get<{ loginAttempts: LoginAttempt[] }>(
          "/login-history"
        );
        setLoginAttempts(response.data.loginAttempts);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch login history");
        setLoading(false);
      }
    };

    fetchLoginHistory();
  }, [isAuth, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );

  return (
    <div className="mt-5">
      <h2 className="mb-4">Login History</h2>
      {loginAttempts.length === 0 ? (
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
            {loginAttempts.map((attempt, index) => (
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
