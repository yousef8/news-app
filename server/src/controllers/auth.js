import jwt from "jsonwebtoken";
import requestIp from "request-ip";
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import ValidationError from "../errors/validationError.js";
import { logInfo } from "../services/loggerService.js";
import { cacheWithExp } from "../services/redisService.js";

const logLoginAttempt = async (user, ip, success = true) => {
  logInfo(
    `${user.email} attempted to login with ${success ? "success" : "failure"}`
  );
  await User.updateOne(
    { _id: user },
    {
      $push: {
        loginAttempts: {
          $each: [{ ip, success }],
          $slice: -10,
        },
      },
    }
  );
};

async function register(req, res, next) {
  const clientIp = requestIp.getClientIp(req);
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

  logInfo(`User with email ${savedUser.email} registered successfully`);
  try {
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    logLoginAttempt(savedUser, clientIp);

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  const clientIp = requestIp.getClientIp(req);
  const [findErr, user] = await asyncWrapper(
    User.findOne({ email: req.validReq.email })
  );

  if (findErr) {
    next(findErr);
    return;
  }
  if (!user) {
    next(new ValidationError("wrong username or password, please try again"));
    return;
  }

  try {
    const validPassword = await user.verifyPassword(req.validReq.password);
    if (!validPassword) {
      logLoginAttempt(user, clientIp, false);
      next(new ValidationError("wrong username or password, please try again"));
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    logLoginAttempt(user, clientIp);

    res.status(200).json({ user, token });
  } catch (err) {
    logLoginAttempt(user, false);
    next(err);
  }
}

const loginAttempts = async (req, res, next) => {
  try {
    const loginAttempts = await User.findOne(
      { _id: req.user },
      { _id: 0, loginAttempts: 1 }
    );

    res.json(loginAttempts);
  } catch (err) {
    next(err);
  }
};

const revokeToken = async (token, expiryTime) => {
  await cacheWithExp(`token:${token}`, "invalid", expiryTime)
  logInfo(`Invalidate token [${token}]`);
};

const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.decode(token);
    const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);

    await revokeToken(token, expiryTime);

    logInfo(`${req.user.email} logged out successfully`);
    res.json({ message: "Logout successful" });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => res.json({ user: req.user });

export default {
  register,
  login,
  logout,
  me,
  loginAttempts,
};
