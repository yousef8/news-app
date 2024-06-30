import logger from "../configs/loggerConfig.js";

export const logInfo = (message, ...args) => {
  logger.info(message, ...args);
};

export const logError = (message, ...args) => {
  logger.error(message, ...args);
};

export const logFatal = (message, ...args) => {
  logger.fatal(message, ...args);
};