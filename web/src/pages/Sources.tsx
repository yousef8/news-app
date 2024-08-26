import React, { useEffect, useState } from "react";
import api from "../api";
import SourceCard from "../components/SourceCard";
import Loading from "../components/Loading";
import Source from "../interfaces/source";
import SourcesSearchForm from "../interfaces/SourcesSearchForm";
import SourcesSearchBar from "../components/SourcesSearchBar";

const Sources: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[] | null>(null);
  const [countries, setCountries] = useState<string[] | null>(null);
  const [languages, setLanguages] = useState<string[] | null>(null);
  const [searchForm, setSearchForm] = useState<SourcesSearchForm>({
    language: "",
    country: "",
    category: "",
    query: "",
  });

  // TODO: Extract useEffect into external custom hook
  useEffect(() => {
    // `ignore` is to prevent race condition check this article from react docs
    // https://react.dev/learn/you-might-not-need-an-effect#fetching-data
    let ignore = false;

    const fetchSources = async () => {
      try {
        const response = await api.get(
          `/sources?q=${searchForm.query}&category=${searchForm.category}&language=${searchForm.language}&country=${searchForm.country}`,
        );
        const sources = response.data.sources;
        if (ignore) {
          return;
        }
        setSources(sources);
        categories ||
          setCategories([
            ...new Set<string>(sources.map((src: Source) => src.category)),
          ]);

        countries ||
          setCountries([
            ...new Set<string>(sources.map((src: Source) => src.country)),
          ]);

        languages ||
          setLanguages([
            ...new Set<string>(sources.map((src: Source) => src.language)),
          ]);
      } catch (err: any) {
        setError(err.message || "Failed to fetch sources");
      } finally {
        setLoading(false);
      }
    };

    fetchSources();

    return () => {
      ignore = true;
    };
  }, [searchForm, categories, languages, countries]);

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
      <SourcesSearchBar
        categories={categories}
        languages={languages}
        countries={countries}
        searchForm={searchForm}
        onSearchChange={setSearchForm}
      ></SourcesSearchBar>
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
