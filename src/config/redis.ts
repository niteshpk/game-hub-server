import { createClient, RedisClientType } from "redis";
import { logError } from "./logger.js";

const createRedisClient = (): RedisClientType => {
  const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  // Redis Event Listeners
  // eslint-disable-next-line no-console
  client.on("connect", () => console.log("✅ Connected to Redis Cloud"));
  client.on("error", (err: Error) => {
    console.error("❌ Redis Error:", err);
    logError(err, { source: "Redis Client" });
  });

  return client as RedisClientType;
};

export default createRedisClient;
