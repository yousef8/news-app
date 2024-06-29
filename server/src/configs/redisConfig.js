import { createClient } from "redis";
import { logError, logInfo } from "../utils/logger.js";

const redisClient = await createClient({ url: "redis://redis:6379" })
  .on("error", (err) => logError(`Redis Connection Error: ${err.message}`))
  .on("connect", () => logInfo("Redis connected successfully"))
  .connect();

export default redisClient;
