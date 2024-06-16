import axios from "axios";
import { logError, logInfo } from "./logger.js";

const newsApi = axios.create({
  baseURL: "https://newsapi.org/v2",
  params: {
    apiKey: process.env.NEWS_API_KEY,
  },
});

newsApi.interceptors.response.use(
  (response) => {
    logInfo(
      `Axios: ${response.config.method.toUpperCase()} ${
        response.config.baseURL
      }${response.config.url} ${response.status} ${response.statusText}`
    );
    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : "N/A";
    const statusText = error.response
      ? error.response.statusText
      : "No Response";
    logError(
      `Axios: ${error.config.method.toUpperCase()} ${error.config.baseURL}${
        error.config.url
      } - ${status} ${statusText}`
    );
    return Promise.reject(error);
  }
);

export default newsApi;
