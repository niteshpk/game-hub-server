import express from "express";
import RAWGApiClient from "../services/rawgApiClient.js";

const router = express.Router();

export default function setupPlatformsRoutes(client) {
  const platformsClient = new RAWGApiClient("/platforms/lists/parents");

  const BASE_URL = "/api/v1/platforms";

  const REDIS_CACHE_EXPIRATION = 2592000; // 30 days

  // Get All platforms (with Redis caching)
  router.get(`${BASE_URL}`, async (req, res) => {
    try {
      const cacheKey = `platforms`;

      // Check if data exists in Redis
      const cachedData = await client.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Fetch from API if not in cache
      const platforms = await platformsClient.getAll();

      // Store in Redis (cache for 1 hour)
      await client.setEx(
        cacheKey,
        process.env.REDIS_CACHE_EXPIRATION || REDIS_CACHE_EXPIRATION,
        JSON.stringify(platforms)
      );

      res.json(platforms);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error fetching platforms", details: error.message });
    }
  });

  return router;
}
