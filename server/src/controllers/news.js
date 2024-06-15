import newsApi from "../utils/newsApi.js";
import redisClient from "../utils/redis.js";
import DEFAULT_EXPIRATION from "../utils/constants.js";
import { logInfo } from "../utils/logger.js";

const subscriptionNews = async (req, res, next) => {
  try {
    const pageSize = 10;
    const maxPages = 10;

    const { page = 1 } = req.query;
    const { sourceIds } = req.user;

    if (page > maxPages) {
      res.status(400).json({
        message: `Only ${maxPages} pages are allowed due to api restriction`,
      });
      return;
    }

    if (sourceIds.length === 0) {
      res.json({ articles: [], pages: page });
      return;
    }
    const newsApiQueryParams = `sources=${sourceIds
      .sort()
      .join(",")}&pageSize=${pageSize}&page=${page}`;
    const cacheKey = `news:${newsApiQueryParams}`;

    const cachedNewsReq = await redisClient.get(cacheKey);

    if (cachedNewsReq) {
      res.json({
        articles: JSON.parse(cachedNewsReq).articles,
        pages: maxPages,
      });
      return;
    }

    const newsReq = await newsApi.get(`/everything?${newsApiQueryParams}`);

    await redisClient.setEx(
      cacheKey,
      DEFAULT_EXPIRATION,
      JSON.stringify(newsReq.data)
    );
    logInfo(`Cached news request with cache key [${cacheKey}]`);

    res.json({ articles: newsReq.data.articles, pages: maxPages });
  } catch (err) {
    next(err);
  }
};

export default {
  subscriptionNews,
};
