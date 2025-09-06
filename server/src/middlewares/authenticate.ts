import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../configs/redisConfig.js";
import AuthenticationError from "../errors/authenticationError.js";
import User from "../models/user.js";
import type { AuthenticatedRequest } from "../types/request.js";
import asyncWrapper from "../utils/asyncWrapper.js";

async function isTokenRevoked(token: string) {
  const [err, value] = await asyncWrapper(redisClient.get(`token:${token}`));

  if (err) {
    throw err;
  }

  if (value) {
    return true;
  }
  return false;
}

async function authenticate(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) {
    next(new AuthenticationError("No Token Exists"));
    return;
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "");

    const isRevoked = await isTokenRevoked(token);
    if (isRevoked) {
      next(new AuthenticationError("Token Expired"));
      return;
    }

    if (typeof payload === "string" || !payload.userId) {
      next(new AuthenticationError("User id doesn't exist"));
      return;
    }

    const user = await User.findById(payload.userId).exec();
    if (!user) {
      next(
        new AuthenticationError(
          `No user found with ${payload.userId} id in DB`,
        ),
      );
      return;
    }

    (req as AuthenticatedRequest).user = user.toObject();
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError(`${err.message}`));
      return;
    }
    next(err);
  }
}

export default authenticate;
