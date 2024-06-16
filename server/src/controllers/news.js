import newsApi from "../utils/newsApi.js";
import { cacheWithExp, getCachedKey } from "../utils/redis.js";

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

    const cachedNewsReq = await getCachedKey(cacheKey);

    if (cachedNewsReq) {
      res.json({
        articles: JSON.parse(cachedNewsReq).articles,
        pages: maxPages,
      });
      return;
    }

    const newsReq = await newsApi.get(`/everything?${newsApiQueryParams}`);

    await cacheWithExp(cacheKey, JSON.stringify(newsReq.data));

    res.json({ articles: newsReq.data.articles, pages: maxPages });
  } catch (err) {
    next(err);
  }
};

export default {
  subscriptionNews,
};
