import newsApi from "../utils/newsApi.js";
import redisClient from "../utils/redis.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import constants from "../utils/constants.js";
import User from "../models/user.js";
import ValidationError from "../errors/validationError.js";
import SourceSubCount from "../models/sourceSubCount.js";
import news from "./news.js";

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

const incSub = async (currentSourceIds, submittedSourceIds) => {
  let newSourceIds = [];

  newSourceIds = submittedSourceIds.filter(
    (sourceId) => !currentSourceIds.includes(sourceId)
  );

  const bulkOperations = newSourceIds.map((sourceId) => ({
    updateOne: {
      filter: { sourceId },
      update: { $inc: { count: 1 } },
      upsert: true,
    },
  }));

  if (bulkOperations.length <= 0) {
    return;
  }

  await SourceSubCount.bulkWrite(bulkOperations);
};

const decSub = async (currentSourceIds, submittedSourceIds) => {
  let newSourceIds = [];

  newSourceIds = submittedSourceIds.filter((sourceId) =>
    currentSourceIds.includes(sourceId)
  );

  const bulkOperations = newSourceIds.map((sourceId) => ({
    updateOne: {
      filter: { sourceId },
      update: { $inc: { count: -1 } },
      upsert: true,
    },
  }));

  if (bulkOperations.length <= 0) {
    return;
  }

  await SourceSubCount.bulkWrite(bulkOperations);
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

    await incSub(req.user.sourceIds, sourceIds);

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
    const { sourceIds } = req.validReq;

    await decSub(req.user.sourceIds, sourceIds);

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { sourceIds: { $in: [...sourceIds] } } },
      {
        returnOriginal: false,
      }
    );

    res.json({ sourceIds: updatedUser.sourceIds });
  } catch (err) {
    next(err);
  }
};

const topSubscribedSources = async (req, res, next) => {
  const topSources = await SourceSubCount.find().sort({ count: -1 }).limit(5);

  res.json({ sources: topSources });
};

export default {
  getSources,
  subscribe,
  unSubscribe,
  topSubscribedSources,
};
