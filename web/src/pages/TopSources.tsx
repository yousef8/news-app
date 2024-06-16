import React, { useEffect, useState } from "react";
import api from "../api";
import TopSource from "../interfaces/TopSource";
import Loading from "../components/Loading";
import TopSourceCard from "../components/TopSourceCard";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/auth/authSlice";

const TopSources: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [topSources, setTopSources] = useState<TopSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const fetchTopSources = async () => {
        const res = await api.get<{ sources: TopSource[] }>("/top-sources");
        setTopSources(res.data.sources);
        setLoading(false);
      };

      fetchTopSources();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  if (loading) <Loading />;
  if (error)
    <div className="alert alert-danger" role="alert">
      {error}
    </div>;

  if (topSources.length <= 0) {
    return (
      <>
        <h2 className="mb-4">Top Sources Subscribed by Our Users</h2>

        <div className="alert alert-info" role="alert">
          No users subscribed to sources yet
        </div>
      </>
    );
  }

  return (
    <>
      <h2 className="mb-4">Top Sources Subscribed by Our Users</h2>
      {topSources.map((topSource) => (
        <TopSourceCard key={topSource.source.id} {...topSource} />
      ))}
    </>
  );
};

export default TopSources;
