import express, { Router, Request, Response } from "express";
import { RedisClientType } from "redis";

const router: Router = express.Router();

interface SetKeyRequest {
  key: string;
  value: unknown;
}

export default function setupRedisRoutes(client: RedisClientType): Router {
  const BASE_URL = "/api/v1";

  // API to Set a Key in Redis
  router.post(
    `${BASE_URL}/set-key`,
    async (
      req: Request<Record<string, never>, Record<string, never>, SetKeyRequest>,
      res: Response
    ) => {
      try {
        const { key, value } = req.body;
        await client.set(key, JSON.stringify(value));
        res.json({ message: `Stored ${key} with value ${value}` });
      } catch (error) {
        res.status(500).json({ error: "Error setting key in Redis" });
      }
    }
  );

  // API to Get a Key from Redis
  router.get(
    `${BASE_URL}/get-key/:key`,
    async (req: Request<{ key: string }>, res: Response) => {
      try {
        const value = await client.get(req.params.key);
        if (value === null) {
          res.status(404).json({ error: "Key not found" });
          return;
        }
        res.json({ key: req.params.key, value: JSON.parse(value) });
      } catch (error) {
        res.status(500).json({ error: "Error retrieving key from Redis" });
      }
    }
  );

  // API to Delete a Key from Redis
  router.delete(
    `${BASE_URL}/delete-key/:key`,
    async (req: Request<{ key: string }>, res: Response) => {
      try {
        const result = await client.del(req.params.key);
        if (result === 0) {
          res.status(404).json({ error: "Key not found" });
          return;
        }
        res.json({ message: `Deleted key: ${req.params.key}` });
      } catch (error) {
        res.status(500).json({ error: "Error deleting key from Redis" });
      }
    }
  );

  // API to Get All Keys
  router.get(`${BASE_URL}/get-keys`, async (_req: Request, res: Response) => {
    try {
      const keys = await client.keys("*");
      res.json({ keys });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving keys from Redis" });
    }
  });

  // API to Delete All Keys
  router.delete(
    `${BASE_URL}/delete-all-keys`,
    async (_req: Request, res: Response) => {
      try {
        const keys = await client.keys("*");
        if (keys.length === 0) {
          res.json({ message: "No keys found in Redis" });
          return;
        }
        await client.del(keys);
        res.json({
          message: `Successfully deleted ${keys.length} keys from Redis`,
        });
      } catch (error) {
        res.status(500).json({ error: "Error deleting all keys from Redis" });
      }
    }
  );

  return router;
}
