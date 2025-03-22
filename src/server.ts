import express, { Application } from "express";
import dotenv from "dotenv";
import createRedisClient from "./config/redis.js";
import setupRoutes from "./config/routes.js";
import { errorLogger, errorHandler } from "./middlewares/errorHandler.js";
import { setupCommonMiddleware } from "./middlewares/common.js";
import { setupPerformanceMonitoring } from "./middlewares/performance.js";
import { setupSanitization } from "./middlewares/sanitization.js";
import { RedisClientType } from "redis";

dotenv.config(); // Load environment variables

const DEFAULT_PORT = 5000;

// Create Redis Client
const redisClient: RedisClientType = createRedisClient();

// Connect to Redis
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
(async () => {
  try {
    // eslint-disable-next-line no-console
    console.log("Connecting to the Redis server...");
    await redisClient.connect();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
})();

const app: Application = express();

// Setup common middleware
setupCommonMiddleware(app);

// Setup performance monitoring
setupPerformanceMonitoring(app);

// Setup sanitization
setupSanitization(app);

// Setup Routes
setupRoutes(app, redisClient);

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

// Start Server
const PORT: number = Number(process.env.PORT) || DEFAULT_PORT;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
