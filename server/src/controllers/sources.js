import newsApi from "../utils/newsApi.js";
import redisClient from "../utils/redis.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import constants from "../utils/constants.js";
import ValidationError from "../errors/validationError.js";
import User from "../models/user.js";

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

const subscribe = async (req, res, next) => {
  try {
    const updateUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $addToSet: { sources: [...req.validReq.sources] } },
      {
        returnOriginal: false,
      }
    );

    res.json({ sources: updateUser.sources });
  } catch (err) {
    next(err);
  }
};

export default {
  getSources,
  subscribe,
};
