import newsApi from "../utils/newsApi.js";
import redisClient from "../utils/redis.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import constants from "../utils/constants.js";

const { DEFAULT_EXPIRATION } = constants;

const getSources = async (req, res, next) => {
  const [getErr, sources] = await asyncWrapper(redisClient.get("sources"));
  if (getErr) {
    next(getErr);
    return;
  }

  if (sources) {
    res.json({ sources: JSON.parse(sources) });
    return;
  }

  const [fetchErr, result] = await asyncWrapper(newsApi.get("/sources"));

  if (fetchErr) {
    next(fetchErr);
    return;
  }

  await redisClient.setEx(
    "sources",
    DEFAULT_EXPIRATION,
    JSON.stringify(result.data.sources)
  );
  res.json({ sources: result.data.sources });
};

export default {
  getSources,
};
