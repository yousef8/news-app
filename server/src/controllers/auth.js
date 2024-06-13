import jwt from "jsonwebtoken";
import User from "../models/user.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import ValidationError from "../errors/validationError.js";

const logLoginAttempt = async (user, success = true) => {
  await User.updateOne(
    { _id: user },
    {
      $push: {
        loginAttempts: {
          $each: [{ success }],
          $slice: -10,
        },
      },
    }
  );
};

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
  try {
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logLoginAttempt(savedUser);

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
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
      logLoginAttempt(user, false);
      next(new ValidationError("wrong username or password, please try again"));
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    logLoginAttempt(user);

    res.status(200).json({ token });
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
export default {
  register,
  login,
  loginAttempts,
};
