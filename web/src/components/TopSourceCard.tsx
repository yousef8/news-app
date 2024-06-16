import React from "react";
import { useAppSelector } from "../store/hooks";
import { selectUser } from "../store/auth/authSlice";
import SubscribeButton from "./SubscribeButton";
import UnSubscribeButton from "./UnSubscribeButton";
import TopSource from "../interfaces/TopSource";

const TopSourceCard: React.FC<TopSource> = ({
  source: { id, name, description, url, category, language, country },
  subCount,
}) => {
  const user = useAppSelector(selectUser);
  const subscribed = user?.sourceIds.includes(id);

  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-column justify-content-around">
        <div>
          <h5 className="card-title">{name}</h5>
          <h6 className="card-subtitle mb-2 text-muted">{category}</h6>
        </div>
        <p className="card-text">{description}</p>
        <a
          href={url}
          className="card-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website
        </a>
        <div className="mt-3">
          <span className="badge bg-primary">{language.toUpperCase()}</span>
          <span className="badge bg-secondary ms-2">
            {country.toUpperCase()}
          </span>
        </div>

        <span className="badge bg-success position-absolute top-0 end-0 m-2">
          Subscribers: {subCount}
        </span>

        <SubscribeButton sourceId={id} />
        {subscribed && <UnSubscribeButton sourceId={id} />}
      </div>
    </div>
  );
};

export default TopSourceCard;
