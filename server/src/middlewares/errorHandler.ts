import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import Joi from "joi";
import mongoose from "mongoose";
import CustomError from "../errors/customError.js";
import { logError } from "../services/loggerService.js";

function formatError(err: unknown): string {
  if (Joi.isError(err)) {
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
    return `Axios Error: ${config?.method?.toUpperCase() || "-"} ${config?.url} ${
      response ? response.status : "N/A"
    } - Response Data: ${
      response ? JSON.stringify(response.data, null, 2) : "N/A"
    }`;
  }

  return `Unhandled Error: ${err instanceof Error ? err.message : String(err)}`;
}

async function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    logError(formatError(err));

    if (Joi.isError(err)) {
      res.status(400).json(
        err.details.reduce(
          (message, error) => {
            message[error.path.join(".")] = error.message;
            return message;
          },
          {} as Record<string, string>,
        ),
      );
      return;
    }

    if (err instanceof CustomError) {
      res.status(err.status).json({ message: err.message });
      return;
    }

    res.status(500).json({ message: `Internal Server Error` });
  } catch (err) {
    logError(
      `Unhandled Error: ${err instanceof Error ? err.message : String(err)}`,
    );
    res.status(500).json({ message: `Internal Server Error` });
  }
}

export default errorHandler;
