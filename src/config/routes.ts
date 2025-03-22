import { Application } from "express";
import { RedisClientType } from "redis";
import setupRedisRoutes from "../routes/redisRoutes.js";
import { setupGamesRoutes } from "../routes/gamesRoutes.js";
import setupGenresRoutes from "../routes/genresRoutes.js";
import setupPlatformsRoutes from "../routes/platformsRoutes.js";
import setupHealthRoutes from "../routes/healthRoutes.js";

const setupRoutes = (app: Application, redisClient: RedisClientType): void => {
  // Base route
  app.get("/", (_req, res) => {
    res.send("Something is working!");
  });

  // API Routes
  app.use(setupRedisRoutes(redisClient));
  app.use(setupGamesRoutes(redisClient));
  app.use(setupGenresRoutes(redisClient));
  app.use(setupPlatformsRoutes(redisClient));
  app.use(setupHealthRoutes());
};

export default setupRoutes;
