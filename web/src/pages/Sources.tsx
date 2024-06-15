import React, { useEffect, useState } from "react";
import api from "../api";
import SourceCard from "../components/SourceCard";

interface Source {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
}

const Sources: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await api.get("/sources");
        setSources(response.data.sources);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch sources");
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mt-5">
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
