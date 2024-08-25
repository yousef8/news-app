import React from "react";
import Article from "../interfaces/article";
import Img from "./Img";

const NewsCard: React.FC<Article> = ({
  source,
  author,
  title,
  description,
  url,
  urlToImage,
  publishedAt,
}) => {
  return (
    <div className="card mb-3">
      <Img
        className="card-img-top"
        src={urlToImage}
        fallBack={`https://api.dicebear.com/9.x/initials/svg?seed=${source.name}`}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{source.name}</h6>
        <p className="card-text">{description}</p>
        <a
          href={url}
          className="btn btn-primary mt-auto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More
        </a>
        <div className="mt-3">
          <small className="text-muted">
            By {author} | Published at {new Date(publishedAt).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
