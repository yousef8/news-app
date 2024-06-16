import newsApi from "../utils/newsApi.js";
import { cacheWithExp, getCachedKey } from "../utils/redis.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import User from "../models/user.js";
import ValidationError from "../errors/validationError.js";
import SourceSubCount from "../models/sourceSubCount.js";
import { logInfo } from "../utils/logger.js";

const getCachedSources = async () => {
  const cacheKey = "sources";

  const sources = await getCachedKey(cacheKey);

  if (sources) {
    return JSON.parse(sources);
  }

  const [fetchErr, result] = await asyncWrapper(
    newsApi.get("/top-headlines/sources")
  );

  if (fetchErr) {
    throw fetchErr;
  }

  await cacheWithExp(cacheKey, JSON.stringify(result.data.sources));

  return result.data.sources;
};

const updateSubCount = async (user, submittedSourceIds, increment = true) => {
  const currentSourceIds = user.sourceIds;
  const filterSources = increment
    ? (sourceId) => !currentSourceIds.includes(sourceId)
    : (sourceId) => currentSourceIds.includes(sourceId);

  const newSourceIds = submittedSourceIds.filter(filterSources);

  if (newSourceIds.length === 0) return;

  const bulkOperations = newSourceIds.map((sourceId) => ({
    updateOne: {
      filter: { sourceId },
      update: { $inc: { count: increment ? 1 : -1 } },
      upsert: true,
    },
  }));

  await SourceSubCount.bulkWrite(bulkOperations);

  logInfo(
    `${
      increment ? "Subscribed to " : "Unsubscribe from "
    } [${newSourceIds}] by user ${user.email}`
  );
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

    const invalidSourceId = sourceIds.find(
      (sourceId) => !sources.some((source) => source.id === sourceId)
    );

    if (invalidSourceId) {
      return next(
        new ValidationError(
          `sourceId [${invalidSourceId}] doesn't exist. Operation aborted`
        )
      );
    }

    await updateSubCount(req.user, sourceIds);

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

    await updateSubCount(req.user, sourceIds, false);

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
  try {
    let topSources = await SourceSubCount.find().sort({ count: -1 }).limit(5);

    if (!topSources) {
      res.json({ sources: [] });
      return;
    }

    const sources = await getCachedSources();

    topSources = topSources.map((topSource) => {
      const source = sources.find((source) => source.id === topSource.sourceId);
      return { source, subCount: topSource.count };
    });

    res.json({ sources: topSources });
  } catch (err) {
    next(err);
  }
};

export default {
  getSources,
  subscribe,
  unSubscribe,
  topSubscribedSources,
};
