import TopSource from "../interfaces/TopSource";
import Loading from "../components/Loading";
import TopSourceCard from "../components/TopSourceCard";
import useFetchUrl from "../hooks/useFetchUrl";

const TopSources: React.FC = () => {
  const { error, loading, data } = useFetchUrl<{ sources: TopSource[] }>(
    "/top-sources",
  );
  const topSources = data?.sources;

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );

  if ((topSources?.length || 0) <= 0) {
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
      {topSources?.map((topSource) => (
        <TopSourceCard key={topSource.source.id} {...topSource} />
      ))}
    </>
  );
};

export default TopSources;
