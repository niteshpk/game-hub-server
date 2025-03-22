import express, { Router, Request, Response, RequestHandler } from "express";
import { RedisClientType } from "redis";
import RAWGApiClient from "../services/rawgApiClient.js";

const router: Router = express.Router();

export default function setupPlatformsRoutes(client: RedisClientType): Router {
  const platformsClient = new RAWGApiClient("/platforms/lists/parents");

  const BASE_URL = "/api/v1/platforms";

  const REDIS_CACHE_EXPIRATION = 2592000; // 30 days

  // Get All platforms (with Redis caching)
  const getAllPlatforms: RequestHandler = async (
    _req: Request,
    res: Response
  ) => {
    try {
      const cacheKey = `platforms`;

      // Check if data exists in Redis
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
      }

      // Fetch from API if not in cache
      const platforms = await platformsClient.getAll();

      // Store in Redis 1 hour)
      await client.setEx(
        cacheKey,
        Number(process.env.REDIS_CACHE_EXPIRATION) || REDIS_CACHE_EXPIRATION,
        JSON.stringify(platforms)
      );

      res.json(platforms);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching platforms",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  router.get(`${BASE_URL}`, getAllPlatforms);

  return router;
}
