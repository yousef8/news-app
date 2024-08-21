import { Client } from "@elastic/elasticsearch";
import { logError, logInfo } from "../services/loggerService.js";

const elasticClient = new Client({
  node: process.env.ELASTIC_URL,
});

elasticClient
  .ping()
  .then(() => logInfo("You are connected to Elasticsearch!"))
  .catch(() => logError("Elasticsearch is not connected."));

export default elasticClient;
