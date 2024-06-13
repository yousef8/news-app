import pino from "pino";

const logPath = "/var/log/app/app.log";

const transport = pino.transport({
  targets: [
    {
      target: "pino-pretty",
      options: { colorize: true },
    },
    {
      target: "pino/file",
      options: { destination: logPath, mkdir: true },
      level: 20,
    },
  ],
});

const logger = pino(transport);

export const logInfo = (message, ...args) => {
  logger.info(message, ...args);
};

export const logError = (message, ...args) => {
  logger.error(message, ...args);
};

export const logFatal = (message, ...args) => {
  logger.fatal(message, ...args);
};

export default logger;
