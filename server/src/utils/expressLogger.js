import pino from "pino-http";
import logger from "./logger.js";

const expressLogger = pino({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    }
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    if (res.statusCode >= 300 && res.statusCode < 400) {
      return "silent";
    }
    return "info";
  },

  customSuccessMessage(req, res) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },

  customSuccessObject(req, res) {
    return null;
  },

  customErrorMessage(req, res, _) {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorObject(req, res, err) {
    return null;
  },

  serializers: {
    req: (req) => null,
    res: (res) => null,
  },
  wrapSerializers: false,
});

export default expressLogger;
