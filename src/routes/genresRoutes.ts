import express, { Router, Request, Response, RequestHandler } from "express";
import { RedisClientType } from "redis";
import RAWGApiClient from "../services/rawgApiClient.js";

const router: Router = express.Router();

export default function setupGenresRoutes(client: RedisClientType): Router {
  const genresClient = new RAWGApiClient("/genres");

  const BASE_URL = "/api/v1/genres";

  const REDIS_CACHE_EXPIRATION = 2592000; // 30 days

  // Get All Genres (with Redis caching)
  const getAllGenres: RequestHandler = async (_req: Request, res: Response) => {
    try {
      const cacheKey = "genres";

      // Check if data exists in Redis
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
      }

      // Fetch from API if not in cache
      const genres = await genresClient.getAll();

      // Store in Redis (cache for 1 hour)
      await client.setEx(
        cacheKey,
        Number(process.env.REDIS_CACHE_EXPIRATION) || REDIS_CACHE_EXPIRATION,
        JSON.stringify(genres)
      );

      res.json(genres);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching genres",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  router.get(`${BASE_URL}`, getAllGenres);

  return router;
}
