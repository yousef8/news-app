import CustomError from "../errors/customError.js";

async function errorHandler(err, req, res, next) {
  if (err.isJoi) {
    res.status(400).json(
      err.details.reduce((message, error) => {
        message[error.context.key] = error.message;
        return message;
      }, {})
    );
    return;
  }

  if (err instanceof CustomError) {
    res.status(err.status).json({ message: err.message });
    return;
  }

  console.log("UnHandled Error", err);
  res.status(500).json({ message: `Internal Server Error` });
}

export default errorHandler;
