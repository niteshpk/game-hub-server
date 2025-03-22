import express from "express";
import RAWGApiClient from "../services/rawgApiClient.js";

const router = express.Router();

export default function setupGenresRoutes(client) {
  const genresClient = new RAWGApiClient("/genres");

  const BASE_URL = "/api/v1/genres";

  const REDIS_CACHE_EXPIRATION = 2592000; // 30 days

  // Get All Genres (with Redis caching)
  router.get(`${BASE_URL}`, async (req, res) => {
    try {
      const cacheKey = `genres`;

      // Check if data exists in Redis
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Fetch from API if not in cache
      const genres = await genresClient.getAll();

      // Store in Redis (cache for 1 hour)
      await client.setEx(
        cacheKey,
        process.env.REDIS_CACHE_EXPIRATION || REDIS_CACHE_EXPIRATION,
        JSON.stringify(genres)
      );

      res.json(genres);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching genres", details: error.message });
    }
  });

  return router;
}
