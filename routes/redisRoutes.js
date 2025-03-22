import express from "express";

const router = express.Router();

export default function setupRedisRoutes(client) {
  const BASE_URL = "/api/v1";

  // API to Set a Key in Redis
  router.post(`${BASE_URL}/set-key`, async (req, res) => {
    try {
      const { key, value } = req.body;
      await client.set(key, JSON.stringify(value));
      res.json({ message: `Stored ${key} with value ${value}` });
    } catch (error) {
      res.status(500).json({ error: "Error setting key in Redis" });
    }
  });

  // API to Get a Key from Redis
  router.get(`${BASE_URL}/get-key/:key`, async (req, res) => {
    try {
      const value = await client.get(req.params.key);
      res.json({ key: req.params.key, value: JSON.parse(value) });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving key from Redis" });
    }
  });

  // API to Delete a Key from Redis
  router.delete(`${BASE_URL}/delete-key/:key`, async (req, res) => {
    try {
      await client.del(req.params.key);
      res.json({ message: `Deleted key: ${req.params.key}` });
    } catch (error) {
      res.status(500).json({ error: "Error deleting key from Redis" });
    }
  });

  // API to Get All Keys
  router.get(`${BASE_URL}/get-keys`, async (req, res) => {
    try {
      const keys = await client.keys("*");
      res.json({ keys });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving keys from Redis" });
    }
  });

  return router;
}
