import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Create Redis Client
const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Redis Event Listeners
client.on("connect", () => console.log("✅ Connected to Redis Cloud"));
client.on("error", (err) => console.error("❌ Redis Error:", err));

// Connect to Redis
(async () => {
  console.log("Connecting to the Redis server...");
  await client.connect();
})();

const BASE_URL = "/api/v1";

// API to Set a Key in Redis
app.post(`${BASE_URL}/set-key`, async (req, res) => {
  try {
    const { key, value } = req.body;
    await client.set(key, JSON.stringify(value)); // Store value as JSON
    res.json({ message: `Stored ${key} with value ${value}` });
  } catch (error) {
    res.status(500).json({ error: "Error setting key in Redis" });
  }
});

// API to Get a Key from Redis
app.get(`${BASE_URL}/get-key/:key`, async (req, res) => {
  try {
    const value = await client.get(req.params.key);
    res.json({ key: req.params.key, value: JSON.parse(value) }); // Parse JSON values
  } catch (error) {
    res.status(500).json({ error: "Error retrieving key from Redis" });
  }
});

// API to Delete a Key from Redis
app.delete("/delete-key/:key", async (req, res) => {
  try {
    await client.del(req.params.key);
    res.json({ message: `Deleted key: ${req.params.key}` });
  } catch (error) {
    res.status(500).json({ error: "Error deleting key from Redis" });
  }
});

// API to Get All Keys
app.get(`${BASE_URL}/get-keys`, async (req, res) => {
  try {
    const keys = await client.keys("*"); // Fetch all keys
    res.json({ keys });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving keys from Redis" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
