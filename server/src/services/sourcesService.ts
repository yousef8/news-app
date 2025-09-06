import { getCachedKey, cacheWithExp } from "./redisService.js";
import SourceSubCount from "../models/sourceSubCount.js";
import { logInfo } from "./loggerService.js";
import newsApiService from "./newsApiService.js";
import type { Source } from "../types/source.js";
import type { User } from "../types/user.js";

const sourcesService = {
  getAllSources: async () => {
    const cacheKey = "sources";
    const cachedSources = await getCachedKey(cacheKey);
    if (cachedSources) {
      return JSON.parse(cachedSources);
    }
    const sources = await newsApiService.fetchSources();
    await cacheWithExp(cacheKey, JSON.stringify(sources));
    return sources;
  },

  updateSubCount: async (
    user: User,
    submittedSourceIds: string[],
    increment: boolean = true,
  ) => {
    const currentSourceIds = user.sourceIds;
    const filterSources = increment
      ? (sourceId: string) => !currentSourceIds.includes(sourceId)
      : (sourceId: string) => currentSourceIds.includes(sourceId);

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
  },

  async isValidSourceId(sourceId: string) {
    const sources = await this.getAllSources();
    return sources.some((source: Source) => source.id === sourceId);
  },
};

export default sourcesService;
