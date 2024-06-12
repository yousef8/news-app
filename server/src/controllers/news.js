import newsApi from "../utils/newsApi.js";
import redisClient from "../utils/redis.js";
import constants from "../utils/constants.js";

const subscriptionNews = async (req, res, next) => {
  try {
    const { sourceIds } = req.user;

    if (sourceIds.length === 0) {
      res.json({ articles: [] });
      return;
    }

    const cacheKey = `news:${sourceIds.sort().join(",")}`;

    const cachedReq = await redisClient.get(cacheKey);

    if (cachedReq) {
      res.json({ articles: JSON.parse(cachedReq).articles });
      return;
    }

    const result = await newsApi.get("/everything", {
      params: {
        sources: req.user.sourceIds.join(","),
      },
    });

    await redisClient.setEx(
      cacheKey,
      constants.DEFAULT_EXPIRATION,
      JSON.stringify(result.data)
    );
    res.json({ articles: result.data.articles });
  } catch (err) {
    next(err);
  }
};

export default {
  subscriptionNews,
};
