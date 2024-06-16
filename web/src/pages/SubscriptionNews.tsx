import React, { useEffect, useState } from "react";
import api from "../api";
import NewsCard from "../components/NewsCard";
import { useAppSelector } from "../store/hooks";
import { selectIsAuth } from "../store/auth/authSlice";
import { Link } from "react-router-dom";
import Article from "../interfaces/article";
import Loading from "../components/Loading";

const SubscriptionNews: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isAuth) {
      const fetchArticles = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
          const response = await api.get<{
            articles: Article[];
            pages: number;
          }>(`/subscription-news?page=${page}`);
          setArticles(response.data.articles);
          setTotalPages(response.data.pages);
        } catch (err: any) {
          setError("Failed to fetch articles");
        } finally {
          setLoading(false);
        }
      };

      fetchArticles(page);
    } else {
      setLoading(false);
    }
  }, [isAuth, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        Error: {error}
      </div>
    );

  return (
    <div className="mt-5">
      <h2 className="mb-4">Subscription News</h2>
      {!isAuth && (
        <div className="alert alert-info" role="alert">
          Please <Link to="/login">log in</Link> to see your subscription news.
        </div>
      )}
      {isAuth && articles.length === 0 && (
        <div className="alert alert-warning" role="alert">
          You have no subscription news at the moment. Please{" "}
          <Link to="/sources">subscribe to some sources</Link> to get
          personalized news.
        </div>
      )}
      {isAuth && (
        <>
          <div className="row">
            {articles.map((article) => (
              <div
                key={article.url}
                className="col-md-4 d-flex align-items-stretch"
              >
                <NewsCard {...article} />
              </div>
            ))}
          </div>
          <div className="pagination-container mt-4 d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      page === index + 1 ? "active" : ""
                    }`}
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
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionNews;
