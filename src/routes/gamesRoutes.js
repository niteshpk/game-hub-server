import express from "express";
import RAWGApiClient from "../services/rawgApiClient.js";

const router = express.Router();

export default function setupGamesRoutes(client) {
  const gamesClient = new RAWGApiClient("/games");

  const BASE_URL = "/api/v1/games";

  const REDIS_CACHE_EXPIRATION = 604800; //(7 days = 7 * 24 * 60 * 60 = 604800 seconds)

  // Get All Games (with Redis caching)
  router.get(`${BASE_URL}`, async (req, res) => {
    try {
      const cacheKey = `games:${JSON.stringify(req.query)}`;

      // Check if data exists in Redis
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        console.log("✅ Serving from Redis Cache");
        return res.json(JSON.parse(cachedData));
      }

      // Fetch from API if not in cache
      const games = await gamesClient.getAll({ params: req.query });

      // Store in Redis (cache for 1 hour)
      await client.setEx(
        cacheKey,
        process.env.REDIS_CACHE_EXPIRATION || REDIS_CACHE_EXPIRATION,
        JSON.stringify(games)
      );

      res.json(games);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching games", details: error.message });
    }
  });

  // Get a Game Movies by Slug (with Redis caching)
  router.get(`${BASE_URL}/:slug/movies`, async (req, res) => {
    try {
      const { slug } = req.params;
      const cacheKey = `game:${slug}:movies`;

      // Check Redis for cached data
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        console.log("✅ Serving from Redis Cache");
        return res.json(JSON.parse(cachedData));
      }

      // Fetch from API if not in cache
      const game = await gamesClient.get(slug + "/movies");

      // Store in Redis (cache for 24 hours)
      await client.setEx(
        cacheKey,
        process.env.REDIS_CACHE_EXPIRATION || REDIS_CACHE_EXPIRATION,
        JSON.stringify(game)
      );

      res.json(game);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching game movie details",
        details: error.message,
      });
    }
  });

  // Get a Game Screenshots by Slug (with Redis caching)
  router.get(`${BASE_URL}/:slug/screenshots`, async (req, res) => {
    try {
      const { slug } = req.params;
      const cacheKey = `game:${slug}:screenshots`;

      // Check Redis for cached data
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        console.log("✅ Serving from Redis Cache");
        return res.json(JSON.parse(cachedData));
      }

      // Fetch from API if not in cache
      const game = await gamesClient.get(slug + "/screenshots");

      // Store in Redis (cache for 24 hours)
      await client.setEx(
        cacheKey,
        process.env.REDIS_CACHE_EXPIRATION || REDIS_CACHE_EXPIRATION,
        JSON.stringify(game)
      );

      res.json(game);
    } catch (error) {
      res.status(500).json({
        error: "Error fetching game movie details",
        details: error.message,
      });
    }
  });

  // Get a Single Game by Slug (with Redis caching)
  router.get(`${BASE_URL}/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const cacheKey = `game:${slug}`;

      // Check Redis for cached data
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        console.log("✅ Serving from Redis Cache");
        return res.json(JSON.parse(cachedData));
      }

      // Fetch from API if not in cache
      const game = await gamesClient.get(slug);

      // Store in Redis (cache for 24 hours)
      await client.setEx(
        cacheKey,
        process.env.REDIS_CACHE_EXPIRATION || REDIS_CACHE_EXPIRATION,
        JSON.stringify(game)
      );

      res.json(game);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching game details", details: error.message });
    }
  });

  return router;
}
