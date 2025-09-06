import type { NextFunction, Request, Response } from "express";
import Joi from "joi";
import type { ValidatedRequest } from "../types/request.js";
import asyncWrapper from "../utils/asyncWrapper.js";

async function validateSubscribeReq(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const schema = Joi.object({
    sourceIds: Joi.array().items(Joi.string()).required(),
  });

  const [joiError, validReq] = await asyncWrapper(
    schema.validateAsync(req.body),
  );

  if (joiError) {
    next(joiError);
  }

  (req as ValidatedRequest).validReq = validReq;
  next();
}

export default validateSubscribeReq;
