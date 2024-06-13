import axios from "axios";

const newsApi = axios.create({
  baseURL: "https://newsapi.org/v2",
  params: {
    apiKey: process.env.NEWS_API_KEY,
  },
});

export default newsApi;