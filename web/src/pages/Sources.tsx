import React, { useEffect, useState } from "react";
import api from "../api";
import SourceCard from "../components/SourceCard";
import Loading from "../components/Loading";
import Source from "../interfaces/source";

const Sources: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await api.get("/sources");
        setSources(response.data.sources);
      } catch (err: any) {
        setError(err.message || "Failed to fetch sources");
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );

  return (
    <div className="container-fluid mt-5">
      <h2 className="mb-4">Sources</h2>
      <div className="row">
        {sources.map((source) => (
          <div key={source.id} className="col-md-4 d-flex align-items-stretch">
            <SourceCard {...source} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sources;
