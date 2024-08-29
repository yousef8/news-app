import React, { useState } from "react";
import SourceCard from "../components/SourceCard";
import Loading from "../components/Loading";
import SourcesSearchForm from "../interfaces/SourcesSearchForm";
import SourcesSearchBar from "../components/SourcesSearchBar";
import useFetchUrl from "../hooks/useFetchUrl";
import useSources from "../hooks/useSources";

const Sources: React.FC = () => {
  const [searchForm, setSearchForm] = useState<SourcesSearchForm>({
    language: "",
    country: "",
    category: "",
    query: "",
  });
  const { error, loading, sources } = useSources(searchForm);

  const { data: catRes } = useFetchUrl<{ categories: string[] }>(
    "/sources/categories",
  );
  const categories = catRes?.categories || [];

  const { data: countriesRes } = useFetchUrl<{ countries: string[] }>(
    "/sources/countries",
  );
  const countries = countriesRes?.countries || [];

  const { data: langRes } = useFetchUrl<{ languages: string[] }>(
    "/sources/languages",
  );
  const languages = langRes?.languages || [];

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
        {sources?.map((source) => (
          <div key={source.id} className="col-md-4 d-flex align-items-stretch">
            <SourceCard {...source} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sources;
