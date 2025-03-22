import express, { Router, Request, Response, RequestHandler } from "express";
import { RedisClientType } from "redis";
import RAWGApiClient from "../services/rawgApiClient.js";

const router: Router = express.Router();
const BASE_URL = "/api/v1/games";
const REDIS_CACHE_EXPIRATION = 86400; // 24 hours in seconds

export const setupGamesRoutes = (redisClient: RedisClientType): Router => {
  const gamesClient = new RAWGApiClient("/games");

  router.get(`${BASE_URL}`, async (req: Request, res: Response) => {
    try {
      const {
        page = 1,
        page_size = 30,
        search = "",
        ordering = "",
        parent_platforms = 1,
        genres = 4,
      } = req.query;
      const cacheKey = `games:${page}:${page_size}:${search}:${ordering}:${parent_platforms}`;

      // Check Redis for cached data
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
      }

      // Filter out null, undefined, empty string, and 0 values
      const validParams: Record<string, string | number> = {};

      if (page && Number(page) > 0) {
        validParams.page = Number(page);
      }
      if (page_size && Number(page_size) > 0) {
        validParams.page_size = Number(page_size);
      }
      if (search && typeof search === "string" && search.trim() !== "") {
        validParams.search = search.trim();
      }
      if (ordering && typeof ordering === "string" && ordering.trim() !== "") {
        validParams.ordering = ordering.trim();
      }
      if (parent_platforms && Number(parent_platforms) > 0) {
        validParams.parent_platforms = Number(parent_platforms);
      }
      if (genres && Number(genres) > 0) {
        validParams.genres = Number(genres);
      }

      // Fetch from API if not in cache
      const games = await gamesClient.getAll({
        params: validParams,
      });

      // Store in Redis
      await redisClient.setEx(
        cacheKey,
        Number(process.env.REDIS_CACHE_EXPIRATION) || REDIS_CACHE_EXPIRATION,
        JSON.stringify(games)
      );

      res.json(games);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching games",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  router.get(
    `${BASE_URL}/:slug/movies`,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        const cacheKey = `game:${slug}:movies`;

        // Check Redis for cached data
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          res.json(JSON.parse(cachedData));
          return;
        }

        // Fetch from API if not in cache
        const movies = await gamesClient.get(`${slug}/movies`);

        // Store in Redis
        await redisClient.setEx(
          cacheKey,
          Number(process.env.REDIS_CACHE_EXPIRATION) || REDIS_CACHE_EXPIRATION,
          JSON.stringify(movies)
        );

        res.json(movies);
      } catch (error) {
        res.status(500).json({
          error: "Error fetching game movies",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  router.get(
    `${BASE_URL}/:slug/screenshots`,
    async (req: Request, res: Response) => {
      try {
        const { slug } = req.params;
        const cacheKey = `game:${slug}:screenshots`;

        // Check Redis for cached data
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
          res.json(JSON.parse(cachedData));
          return;
        }

        // Fetch from API if not in cache
        const screenshots = await gamesClient.get(`${slug}/screenshots`);

        // Store in Redis
        await redisClient.setEx(
          cacheKey,
          Number(process.env.REDIS_CACHE_EXPIRATION) || REDIS_CACHE_EXPIRATION,
          JSON.stringify(screenshots)
        );

        res.json(screenshots);
      } catch (error) {
        res.status(500).json({
          error: "Error fetching game screenshots",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  router.get(`${BASE_URL}/:slug`, async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const cacheKey = `game:${slug}`;

      // Check Redis for cached data
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
      }

      // Fetch from API if not in cache
      const game = await gamesClient.get(slug);

      // Store in Redis
      await redisClient.setEx(
        cacheKey,
        Number(process.env.REDIS_CACHE_EXPIRATION) || REDIS_CACHE_EXPIRATION,
        JSON.stringify(game)
      );

      res.json(game);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching game details",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  return router;
};
