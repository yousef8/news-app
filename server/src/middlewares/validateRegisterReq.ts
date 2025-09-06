import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

async function validateRegisterReq(req, res, next) {
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
    schema.validateAsync(req.body)
  );

  if (joiError) {
    next(joiError);
  }

  req.validReq = validReq;
  next();
}

export default validateRegisterReq;
