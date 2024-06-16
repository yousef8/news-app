import { createClient } from "redis";
import DEFAULT_EXPIRATION from "./constants.js";
import { logError, logInfo } from "./logger.js";

const redisClient = await createClient({ url: "redis://redis:6379" })
  .on("error", (err) => logError(`Redis Connection Error: ${err.message}`))
  .on("connect", () => logInfo("Redis connected successfully"))
  .connect();

export const cacheWithExp = async (
  key,
  value,
  expiration = DEFAULT_EXPIRATION
) => {
  await redisClient.setEx(key, expiration, value);
  logInfo(`Cached new key [${key}] to redis`);
};

export const getCachedKey = async (key) => {
  const value = await redisClient.get(key);
  if (value) {
    logInfo(`Retrieved [${key}] successfully from redis`);
  } else {
    logInfo(`Tried retrieving [${key}] from redis but doens't exists`);
  }

  return value;
};
export default redisClient;
