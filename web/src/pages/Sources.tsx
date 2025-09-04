import React, { useState, useMemo } from "react";
import SourceCard from "../components/SourceCard";
import Loading from "../components/Loading";
import SourcesSearchForm from "../interfaces/SourcesSearchForm";
import SourcesSearchBar from "../components/SourcesSearchBar";
import useFetchUrl from "../hooks/useFetchUrl";
import Source from "../interfaces/source";

const Sources: React.FC = () => {
  const [searchForm, setSearchForm] = useState<SourcesSearchForm>({
    language: "",
    country: "",
    category: "",
    query: "",
  });

  const { error, loading, data } = useFetchUrl<{ sources: Source[] }>('/sources');
  const sources = useMemo(() => data?.sources || [], [data]);

  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const countries = new Set<string>();
    const languages = new Set<string>();

    sources.forEach(source => {
      categories.add(source.category);
      countries.add(source.country);
      languages.add(source.language);
    });

    return {
      categories: Array.from(categories),
      countries: Array.from(countries),
      languages: Array.from(languages),
    };
  }, [sources]);

  const filteredSources = useMemo(() => {
    return sources.filter((source) => {
      const categoryMatch = !searchForm.category || source.category === searchForm.category;
      const countryMatch = !searchForm.country || source.country === searchForm.country;
      const languageMatch = !searchForm.language || source.language === searchForm.language;
      const queryMatch = !searchForm.query ||
        source.name.toLowerCase().includes(searchForm.query.toLowerCase()) ||
        source.description?.toLowerCase().includes(searchForm.query.toLowerCase());

      return categoryMatch && countryMatch && languageMatch && queryMatch;
    });
  }, [sources, searchForm]);


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
        categories={filterOptions.categories}
        languages={filterOptions.languages}
        countries={filterOptions.countries}
        searchForm={searchForm}
        onSearchChange={setSearchForm}
      ></SourcesSearchBar>
      <div className="row">
        {filteredSources?.map((source) => (
          <div key={source.id} className="col-md-4 d-flex align-items-stretch">
            <SourceCard {...source} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sources;
