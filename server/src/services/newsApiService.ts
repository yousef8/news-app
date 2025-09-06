import newsApi from "../utils/newsApi.js";

const newsApiService = {
  fetchSources: async () => {
    const result = await newsApi.get("/top-headlines/sources");
    return result.data.sources;
  },
};

export default newsApiService;
