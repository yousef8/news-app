import { getCachedKey, cacheWithExp } from "./redisService.js";
import SourceSubCount from "../models/sourceSubCount.js";
import newsApi from "../utils/newsApi.js";
import { logInfo } from "../utils/logger.js";

export  const getAllSources = async () => {
  const cacheKey = "sources";

  const sources = await getCachedKey(cacheKey);

  if (sources) {
    return JSON.parse(sources);
  }

  const result = await newsApi.get("/top-headlines/sources");

  await cacheWithExp(cacheKey, JSON.stringify(result.data.sources));

  return result.data.sources;
};

export const updateSubCount = async (user, submittedSourceIds, increment = true) => {
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

export const isValidSourceId = async (sourceId) => {
    const sources = await getAllSources();
    return sources.some((source) => source.id === sourceId)
}