import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

async function validateSubscribeReq(req, res, next) {
  const schema = Joi.object({
  sources: Joi.array().items(Joi.string()).required(),
  });

  const [joiError, validReq] = await asyncWrapper(
    schema.validateAsync(req.body)
  );

  if (joiError) {
    next(joiError);
  }

  req.validReq = validReq;
  next();
}

export default validateSubscribeReq;
