import elasticClient from "../configs/elasticConfig.js";
import { logError, logInfo } from "./loggerService.js";
import constants from "../utils/constants.js";

const elasticService = {
  getAllSources: async () => {
    try {
      const result = await elasticClient.search({
        index: constants.SOURCES_ELASTIC_IDX_NAME,
        body: {
          size: 300, // sources are around 130, so i set 300 to be on safe side
          query: {
            match_all: {},
          },
        },
      });
      const sources = result.hits.hits.map((hit) => hit._source);
      logInfo(`ElasticService: fetched all sources successfully`);
      return sources;
    } catch (err) {
      logError(`elasticService.getAllSources: ${err.message}`);
      throw err;
    }
  },
  idxSources: async (sources) => {
    try {
      const indexPromises = sources.map((source, idx) =>
        elasticClient
          .index({
            index: constants.SOURCES_ELASTIC_IDX_NAME,
            id: source.id,
            body: {
              id: source.id,
              name: source.name,
              description: source.description,
              url: source.url,
              category: source.category,
              language: source.language,
              country: source.country,
            },
          })
          .then(() =>
            logInfo(
              `ElasticService: ${idx + 1} - ${source.name} indexed successfully`,
            ),
          ),
      );

      await Promise.all(indexPromises);
    } catch (err) {
      logError(`idxSources: ${err.message}`);
      throw err;
    }
  },
  resetSourcesIdx: async () => {
    try {
      await elasticClient.indices.delete({
        index: constants.SOURCES_ELASTIC_IDX_NAME,
        ignore_unavailable: true,
      });

      await elasticClient.indices.create({
        index: constants.SOURCES_ELASTIC_IDX_NAME,
        body: {
          mappings: {
            properties: {
              id: {
                enabled: false,
              },
              name: {
                type: "text",
              },
              description: {
                type: "text",
              },
              url: {
                enabled: false,
              },
              category: {
                type: "keyword",
              },
              language: {
                type: "keyword",
              },
              country: {
                type: "keyword",
              },
            },
          },
        },
      });
      logInfo(
        `ElasticService: Reset ${constants.SOURCES_ELASTIC_IDX_NAME} successfully`,
      );
    } catch (err) {
      logError(`resetSourcesIdx: ${err.message}`);
      throw err;
    }
  },
};

export default elasticService;
