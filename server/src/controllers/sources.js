import User from "../models/user.js";
import ValidationError from "../errors/validationError.js";
import SourceSubCount from "../models/sourceSubCount.js";
import sourcesService from "../services/sourcesService.js";

const getSources = async (req, res, next) => {
  try {
    const { q, category, country, language } = req.query;
    const sources = await sourcesService.searchSources(q, {
      category,
      country,
      language,
    });
    res.json({ sources });
  } catch (err) {
    next(err);
  }
};

const subscribe = async (req, res, next) => {
  try {
    const { sourceIds } = req.validReq;
    const invalidSourceId = sourceIds.find(
      (sourceId) => !sourcesService.isValidSourceId(sourceId),
    );

    if (invalidSourceId) {
      next(
        new ValidationError(
          `sourceId [${invalidSourceId}] doesn't exist. Operation aborted`,
        ),
      );
      return;
    }

    await sourcesService.updateSubCount(req.user, sourceIds);

    const updateUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $addToSet: { sourceIds: [...req.validReq.sourceIds] } },
      {
        returnOriginal: false,
      },
    );

    res.json({ sourceIds: updateUser.sourceIds });
  } catch (err) {
    next(err);
  }
};

const unSubscribe = async (req, res, next) => {
  try {
    const { sourceIds } = req.validReq;

    await sourcesService.updateSubCount(req.user, sourceIds, false);

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $pull: { sourceIds: { $in: [...sourceIds] } } },
      {
        returnOriginal: false,
      },
    );

    res.json({ sourceIds: updatedUser.sourceIds });
  } catch (err) {
    next(err);
  }
};

const topSubscribedSources = async (req, res, next) => {
  try {
    let topSources = await SourceSubCount.find({ count: { $gt: 0 } })
      .sort({ count: -1 })
      .limit(5);

    if (!topSources) {
      res.json({ sources: [] });
      return;
    }

    const sources = await sourcesService.getAllSources();

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
