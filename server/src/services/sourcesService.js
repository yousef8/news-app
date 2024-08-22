import { getCachedKey, cacheWithExp } from "./redisService.js";
import SourceSubCount from "../models/sourceSubCount.js";
import { logInfo, logError } from "./loggerService.js";
import constants from "../utils/constants.js";
import elasticService from "./elasticService.js";
import newsApiService from "./newsApiService.js";

const setupSources = async () => {
  try {
    const isSourcesCached = await getCachedKey(constants.SOURCES_CACHE_KEY);
    if (isSourcesCached) {
      return;
    }
    await elasticService.resetSourcesIdx();
    const sources = await newsApiService.fetchSources();
    await elasticService.idxSources(sources);
    await cacheWithExp(constants.SOURCES_CACHE_KEY, "true");
  } catch (err) {
    logError(`setupSources(): ${err.message}`);
    throw err;
  }
};

export const getAllSources = async () => {
  await setupSources();
  const sources = elasticService.getAllSources();
  return sources;
};

export const searchSources = async (
  searchTerm = "",
  filters = { category: "", country: "", language: "" },
) => {
  await setupSources();
  const sources = await elasticService.searchSources(searchTerm, filters);
  return sources;
};

export const updateSubCount = async (
  user,
  submittedSourceIds,
  increment = true,
) => {
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
    } [${newSourceIds}] by user ${user.email}`,
  );
};

export const isValidSourceId = async (sourceId) => {
  const sources = await getAllSources();
  return sources.some((source) => source.id === sourceId);
};
