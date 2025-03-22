import express, { Router, Request, Response, RequestHandler } from "express";
import { RedisClientType } from "redis";
import RAWGApiClient from "../services/rawgApiClient.js";

const router: Router = express.Router();
const BASE_URL = "/games";
const REDIS_CACHE_EXPIRATION = 86400; // 24 hours in seconds

export const setupGamesRoutes = (redisClient: RedisClientType): Router => {
  const gamesClient = new RAWGApiClient("/games");

  const getAllGames: RequestHandler = async (req: Request, res: Response) => {
    try {
      const { page = 1, page_size = 20, search, ordering } = req.query;
      const cacheKey = `games:${page}:${page_size}:${search}:${ordering}`;

      // Check Redis for cached data
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        res.json(JSON.parse(cachedData));
        return;
      }

      // Fetch from API if not in cache
      const games = await gamesClient.getAll({
        params: {
          page: Number(page),
          page_size: Number(page_size),
          search: search as string,
          ordering: ordering as string,
        },
      });

      // Store in Redis (cache for 24 hours)
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
  };

  const getGameMovies: RequestHandler = async (req: Request, res: Response) => {
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

      // Store in Redis (cache for 24 hours)
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
  };

  const getGameScreenshots: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
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

      // Store in Redis (cache for 24 hours)
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
  };

  const getGame: RequestHandler = async (req: Request, res: Response) => {
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

      // Store in Redis (cache for 24 hours)
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
  };

  router.get(`${BASE_URL}`, getAllGames);
  router.get(`${BASE_URL}/:slug/movies`, getGameMovies);
  router.get(`${BASE_URL}/:slug/screenshots`, getGameScreenshots);
  router.get(`${BASE_URL}/:slug`, getGame);

  return router;
};
