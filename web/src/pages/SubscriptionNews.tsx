import React, { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import { useAppSelector } from "../store/hooks";
import { selectIsAuth } from "../store/auth/authSlice";
import { Link } from "react-router-dom";
import Article from "../interfaces/article";
import Loading from "../components/Loading";
import useFetchUrl from "../hooks/useFetchUrl";

const SubscriptionNews: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const [page, setPage] = useState(1);
  const { error, loading, data } = useFetchUrl<{
    articles: Article[];
    pages: number;
  }>(`/subscription-news?page=${page}`, { shouldFetch: isAuth });

  const totalPages = data?.pages;
  const articles = data?.articles;

  useEffect(() => {
    if (!isAuth) {
      return;
    }
  }, [isAuth]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!isAuth) {
    return (
      <div className="alert alert-info" role="alert">
        Please <Link to="/login">log in</Link> to see your subscription news.
      </div>
    );
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );
  }

  if (isAuth && articles?.length === 0) {
    return (
      <div className="alert alert-warning" role="alert">
        You have no subscription news at the moment. Please{" "}
        <Link to="/sources">subscribe to some sources</Link> to get personalized
        news.
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2 className="mb-4">Subscription News</h2>
      {isAuth && (
        <>
          <div className="row">
            {articles?.map((article) => (
              <div
                key={article.url}
                className="col-md-4 d-flex align-items-stretch"
              >
                <NewsCard {...article} />
              </div>
            ))}
          </div>
          <nav aria-label="Navigate subscription news result pages">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page - 1)}
                >
                  &laquo;
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${page === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(page + 1)}
                >
                  &raquo;
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
};

export default SubscriptionNews;
