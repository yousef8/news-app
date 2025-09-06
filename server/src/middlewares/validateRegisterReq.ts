import type { NextFunction, Request, Response } from "express";
import Joi from "joi";
import type { ValidatedRequest } from "../types/request.js";
import asyncWrapper from "../utils/asyncWrapper.js";

async function validateRegisterReq(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const schema = Joi.object({
    name: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z]+ [a-zA-Z]+$/)
      .min(3)
      .required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required(),
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

export default validateRegisterReq;
