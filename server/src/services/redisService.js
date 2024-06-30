import redisClient from "../configs/redisConfig.js";
import DEFAULT_EXPIRATION from "../utils/constants.js";
import { logInfo } from "./loggerService.js";

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
