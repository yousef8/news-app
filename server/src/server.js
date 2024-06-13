import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";
import expressLogger from "./utils/expressLogger.js";

const app = express();
const port = 3000;
const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1:27017/news-app";

app.use(express.json());

app.use(expressLogger);
app.use(router);

app.use(errorHandler);

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`DB connected to ${DB_URL}`);
      console.log(`[Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(
      `Couldn't establish connection with MongoDB server, due to : ${err}`
    );
  });
