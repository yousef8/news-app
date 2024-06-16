import mongoose from "mongoose";
import axios from "axios";
import { logError } from "../utils/logger.js";
import CustomError from "../errors/customError.js";

function formatError(err) {
  if (err.isJoi) {
    return `Validation Error: ${err.details.map((e) => e.message).join(", ")}`;
  }

  if (err instanceof CustomError) {
    return `CustomError: ${err.message}`;
  }

  if (err instanceof mongoose.Error) {
    return `Mongoose Error: ${err.message}`;
  }

  if (axios.isAxiosError(err)) {
    const { response, config } = err;
    return `Axios Error: ${config.method.toUpperCase()} ${config.url} ${
      response ? response.status : "N/A"
    } - Response Data: ${
      response ? JSON.stringify(response.data, null, 2) : "N/A"
    }`;
  }

  return `Unhandled Error: ${err.message}`;
}

async function errorHandler(err, req, res, next) {
  try {
    logError(formatError(err));

    if (err.isJoi) {
      res.status(400).json(
        err.details.reduce((message, error) => {
          message[error.context.key] = error.message;
          return message;
        }, {})
      );
      return;
    }

    if (err instanceof CustomError) {
      res.status(err.status).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: `Internal Server Error` });
  } catch (err) {
    logError(`Unhandled Error: ${err.message}`);
    res.status(500).json({ message: `Internal Server Error` });
  }
}

export default errorHandler;
