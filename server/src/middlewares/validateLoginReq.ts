import type { NextFunction, Request, Response } from "express";
import Joi from "joi";
import type { ValidatedRequest } from "../types/request.js";
import asyncWrapper from "../utils/asyncWrapper.js";

const validateLoginReq = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  });
  const [err, validReq] = await asyncWrapper(
    loginSchema.validateAsync(req.body),
  );
  if (!err) {
    (req as ValidatedRequest).validReq = validReq;
    return next();
  }
  return next(err);
};

export default validateLoginReq;
