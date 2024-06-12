import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const DB_URL = "mongodb://mongo/news-app";

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

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
