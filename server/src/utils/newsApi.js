import axios from "axios";
import { logError, logInfo } from "./logger.js";

function stringify(obj) {
  return JSON.stringify(obj, null, 2);
}
const newsApi = axios.create({
  baseURL: "https://newsapi.org/v2",
  params: {
    apiKey: process.env.NEWS_API_KEY,
  },
});

newsApi.interceptors.request.use(
  (request) => {
    logInfo(
      `Request sent Successfully ${stringify({
        method: request.method,
        url: (request.baseURL || "") + request.url,
        data: request.data,
        headers: request.headers,
      })}`
    );
    return request;
  },
  (error) => {
    logError(`Request error`, error);
    return Promise.reject(error);
  }
);

newsApi.interceptors.response.use(
  (response) => {
    logInfo(
      `Response received successfully ${stringify({
        status: response.status,
        headers: response.headers,
      })}`
    );
    return response;
  },
  (error) => {
    logError(`Response error`, error);
    return Promise.reject(error);
  }
);

export default newsApi;
