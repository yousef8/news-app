import newsApi from "../utils/newsApi.js";
import redisClient from "../utils/redis.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import constants from "../utils/constants.js";
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

  const [fetchErr, result] = await asyncWrapper(
    newsApi.get("/top-headlines/sources")
  );

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
      { $addToSet: { sourceIds: [...req.validReq.sourceIds] } },
      {
        returnOriginal: false,
      }
    );

    res.json({ sourceIds: updateUser.sourceIds });
  } catch (err) {
    next(err);
  }
};

const unSubscribe = async (req, res, next) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { sourceIds: { $in: [...req.validReq.sourceIds] } } },
      {
        returnOriginal: false,
      }
    );

    res.json({ sourceIds: updatedUser.sourceIds });
  } catch (err) {
    next(err);
  }
};
export default {
  getSources,
  subscribe,
  unSubscribe,
};
