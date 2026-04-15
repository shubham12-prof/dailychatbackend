import { Redis } from "ioredis";

// const redis = new Redis({
//   host: "127.0.0.1",
//   port: 6379,
// });

const redis = new Redis(process.env.REDIS_URL!);

redis.on("error", (err) => console.log("Redis Client Error:", err));
redis.on("connect", () => console.log("Redis connected successfully"));

export default redis;
