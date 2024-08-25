import React from "react";
import SourcesSearchForm from "../interfaces/SourcesSearchForm";
import { getLangNameFromIsoCode } from "../services/Language.service";
import isoCountries from "../services/IsoCountries.service";

interface SourcesSearchBarProp {
  searchForm: SourcesSearchForm;
  categories: string[] | null;
  languages: string[] | null;
  countries: string[] | null;
  onSearchChange: (newForm: SourcesSearchForm) => void;
}

const SourcesSearchBar: React.FC<SourcesSearchBarProp> = ({
  searchForm,
  categories,
  countries,
  languages,
  onSearchChange,
}) => {
  return (
    <form className="row g-3 align-items-center mb-4">
      <div className="col-md-4">
        <input
          type="text"
          className="form-control form-control-lg"
          id="searchQuery"
          placeholder="Search By Name"
          aria-label="Search"
          value={searchForm.query}
          onChange={(e) =>
            onSearchChange({ ...searchForm, query: e.target.value })
          }
        />
      </div>

      {/* <!-- Category Filter --> */}
      <div className="col-md-2">
        <select
          className="form-select form-select-lg"
          id="categoryFilter"
          aria-label="Category"
          value={searchForm.category}
          onChange={(e) =>
            onSearchChange({ ...searchForm, category: e.target.value })
          }
        >
          <option value={""}>Category</option>
          {categories?.map((category: string) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* <!-- Country Filter --> */}
      <div className="col-md-2">
        <select
          className="form-select form-select-lg"
          id="countryFilter"
          aria-label="Country"
          value={searchForm.country}
          onChange={(e) =>
            onSearchChange({ ...searchForm, country: e.target.value })
          }
        >
          <option value={""}>Country</option>
          {countries?.map((country) => (
            <option value={country} key={country}>
              {isoCountries[country.toUpperCase()]?.name || country}
            </option>
          ))}
        </select>
      </div>

      {/* <!-- Language Filter --> */}
      <div className="col-md-2">
        <select
          className="form-select form-select-lg"
          id="languageFilter"
          aria-label="Language"
          onChange={(e) =>
            onSearchChange({ ...searchForm, language: e.target.value })
          }
          value={searchForm.language}
        >
          <option value="">Language</option>
          {languages?.map((lang) => (
            <option value={lang} key={lang}>
              {getLangNameFromIsoCode(lang)}
            </option>
          ))}
        </select>
      </div>

      {/* <!-- Submit Button --> */}
      <div className="col-md-2">
        <button
          className="btn btn-primary btn-lg w-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSearchChange({
              language: "",
              country: "",
              category: "",
              query: "",
            });
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
};

export default SourcesSearchBar;
