import logger from "../configs/loggerConfig.js";

export const logInfo = (message: string, ...args: any[]) => {
  logger.info(message, ...args);
};

export const logError = (message: string, ...args: any[]) => {
  logger.error(message, ...args);
};

export const logFatal = (message: string, ...args: any[]) => {
  logger.fatal(message, ...args);
};