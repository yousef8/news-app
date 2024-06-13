import newsApi from "../utils/newsApi.js";
import redisClient from "../utils/redis.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import constants from "../utils/constants.js";
import User from "../models/user.js";
import ValidationError from "../errors/validationError.js";

const { DEFAULT_EXPIRATION } = constants;

const getCachedSources = async () => {
  const cacheKey = "sources";

  const [getErr, sources] = await asyncWrapper(redisClient.get(cacheKey));
  if (getErr) {
    throw getErr;
  }

  if (sources) {
    return JSON.parse(sources);
  }

  const [fetchErr, result] = await asyncWrapper(
    newsApi.get("/top-headlines/sources")
  );

  if (fetchErr) {
    throw fetchErr;
  }

  await redisClient.setEx(
    cacheKey,
    DEFAULT_EXPIRATION,
    JSON.stringify(result.data.sources)
  );
  return result.data.sources;
};

const getSources = async (req, res, next) => {
  try {
    const sources = await getCachedSources();
    res.json({ sources });
  } catch (err) {
    next(err);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const sources = await getCachedSources();

    const { sourceIds } = req.validReq;

    sourceIds.forEach((sourceId) => {
      const isExists = sources.some((source) => source.id === sourceId);
      if (!isExists) {
        next(
          new ValidationError(
            `sourceId [${sourceId}] doesn't exist. Operation aborted`
          )
        );
      }
    });

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
