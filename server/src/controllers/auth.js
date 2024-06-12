import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import ValidationError from "../errors/validationError.js";

async function register(req, res, next) {
  const [findErr, existingUser] = await asyncWrapper(
    User.findOne({ email: req.validReq.email })
  );

  if (findErr) {
    next(findErr);
    return;
  }

  if (existingUser) {
    next(new ValidationError("User already exists"));
    return;
  }

  const newUser = new User({
    ...req.validReq,
  });

  const [createErr, savedUser] = await asyncWrapper(newUser.save());

  if (createErr) {
    next(createErr);
    return;
  }

  const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(201).json({ user: newUser, token });
}

async function login(req, res, next) {
  const user = await User.findOne({ email: req.validReq.email });
  if (!user) {
    next(new ValidationError("wrong username or password, please try again"));
    return;
  }

  const validPassword = await user.verifyPassword(req.validReq.password);
  if (!validPassword) {
    next(new ValidationError("wrong username or password, please try again"));
    return;
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
}

export default {
  register,
  login,
};