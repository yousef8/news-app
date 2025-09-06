import Joi from "joi";
import asyncWrapper from "../utils/asyncWrapper.js";

const validateLoginReq = async (req, res, next) => {
  const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  });
  const [err, validReq] = await asyncWrapper(
    loginSchema.validateAsync(req.body)
  );
  if (!err) {
    req.validReq = validReq;
    return next();
  }
  return next(err);
};

export default validateLoginReq;
