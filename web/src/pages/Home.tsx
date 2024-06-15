import React, { useEffect, useState } from "react";
import api from "../api";
import NewsCard from "../components/NewsCard";
import { useAppSelector } from "../store/hooks";
import { selectIsAuth } from "../store/auth/authSlice";
import { Link } from "react-router-dom";
import Article from "../interfaces/article";

const Home: React.FC = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuth) {
      const fetchArticles = async () => {
        try {
          const response = await api.get<{ articles: Article[] }>(
            "/subscription-news"
          );
          setArticles(response.data.articles);
          setLoading(false);
        } catch (err: any) {
          setError(err.message || "Failed to fetch news articles");
          setLoading(false);
        }
      };

      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [isAuth]);

  if (loading) return <div>Loading...</div>;
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
      )}
    </div>
  );
};

export default Home;
