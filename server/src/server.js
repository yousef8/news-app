import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";
import expressLogger from "./utils/expressLogger.js";
import { logInfo, logError } from "./utils/logger.js";

const app = express();
const port = 3000;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/news-app";
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(expressLogger);
app.use(router);

app.use(errorHandler);

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(port, () => {
      logInfo(`DB connected to ${DB_URL}`);
      logInfo(`[Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    logError(
      `Couldn't establish connection with MongoDB server, due to : ${err}`
    );
  });
