import redisClient from "../configs/redisConfig.js";
import constants from "../utils/constants.js";
import { logError, logInfo } from "./loggerService.js";

export const cacheWithExp = async (
  key,
  value,
  expiration = constants.DEFAULT_EXPIRATION,
) => {
  // TODO: Handle any error
  try {
    await redisClient.setEx(key, expiration, value);
    logInfo(`Cached new key [${key}] to redis`);
  } catch (err) {
    logError(`cacheWithExp: ${err.message}`);
    throw err;
  }
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
