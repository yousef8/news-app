import { createClient } from "redis";

const redisClient = await createClient({ url: "redis://redis:6379" })
  .on("error", (err) => console.log("Redis Client Error", err))
  .on("connect", () => console.log("Redis connected successfully"))
  .connect();

export default redisClient;
