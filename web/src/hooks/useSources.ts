import SourcesSearchForm from "../interfaces/SourcesSearchForm";
import Source from "../interfaces/source";
import useFetchUrl from "./useFetchUrl";

export default function useSources(searchForm: SourcesSearchForm) {
  const url = `/sources?q=${searchForm.query}&category=${searchForm.category}&language=${searchForm.language}&country=${searchForm.country}`;

  const { error, loading, data } = useFetchUrl<{ sources: Source[] }>(url, {
    debounce: 500,
  });

  return { error, loading, sources: data?.sources };
}
