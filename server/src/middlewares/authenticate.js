import jwt from "jsonwebtoken";
import User from "../models/user.js";
import AuthenticationError from "../errors/authenticationError.js";

async function authenticate(req, res, next) {
  const token = req.header("authorization");
  if (!token) {
    next(new AuthenticationError("No Token Exists"));
    return;
  }

  try {
    const payload = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    if (!payload.userId) {
      next(new AuthenticationError("User id doesn't exist"));
    }

    const user = await User.findById(payload.userId).exec();
    if (!user) {
      next(
        new AuthenticationError(`No user found with ${payload.userId} id in DB`)
      );
      return;
    }

    req.user = user;
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
